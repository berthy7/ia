from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
import json

import random
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer

from keras.models import Sequential
from keras.layers import Dense,Activation,Dropout
from keras.optimizers import SGD
from keras.models import load_model

from system.chatBot.models import Intent,Pattern,Response,Setting

lemmatizer = WordNetLemmatizer()



@login_required
def index(request):
    return render(request, 'chatBot/index.html')


@login_required
def mensaje(request,mensaje):
    try:
        intents = obtenerIntenciones()
        ints = predictClass(mensaje)
        res = getResponse(ints,intents)
        return JsonResponse(dict(success=True, tipo="success",mensaje="Correcto", data=res), safe=False)
    except Exception as e:
        print(e.args[0])
        return JsonResponse(dict(success=False,tipo="error", mensaje=e.args[0], data=None))

def getResponse(tag,intents_json):
    list_of_intents = intents_json
    result = ""
    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i['responses'])
            break
    return result

def predictClass(sentence):
    classes = pickle.load(open('classes.pkl','rb'))
    model = load_model('chatbot_model.h5')

    bow = bagOfWords(sentence)
    res = model.predict(np.array([bow]))[0]
    max_index = np.where(res == np.max(res))[0][0]
    category = classes[max_index]
    return category

def bagOfWords(sentence):
    words = pickle.load(open('words.pkl','rb'))

    sentence_words = cleanUpSentence(sentence)
    bag = [0]*len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def cleanUpSentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words



def obtenerIntenciones():
    intents = list(Intent.objects.all().values('id','tag'))
    for i in intents:
        i['patterns'] = []
        i['responses'] = []
        for p in list(Pattern.objects.filter(fkintent=i['id']).all().values('message')):
            i['patterns'].append(p['message'])
        for r in list(Response.objects.filter(fkintent=i['id']).all().values('message')):
            i['responses'].append(r['message'])

    return intents

@login_required
def entrenar(request):
    try:

        setting = Setting.objects.get(id=1)


        intents = obtenerIntenciones()

        nltk.download('punkt')
        nltk.download('wordnet')
        nltk.download('omw-1.4')

        words= []
        classes= []
        documents=[]
        ignore_letters = ['?','!','.',',']

        for intent in intents:
            for pattern in intent['patterns']:
                word_list = nltk.word_tokenize(pattern)
                words.extend(word_list)
                documents.append((word_list,intent['tag']))
                if intent['tag'] not in classes:
                    classes.append(intent['tag'])

        words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters]
        words = sorted(set(words))

        pickle.dump(words,open('words.pkl','wb'))
        pickle.dump(classes,open('classes.pkl','wb'))

        training = []
        outoput_empty = [0]*len(classes)
        for document in documents:
            bag = []
            word_pattenrs = document[0]
            word_pattenrs = [lemmatizer.lemmatize(word.lower()) for word in word_pattenrs]
            for word in words:
                bag.append(1) if word in word_pattenrs else bag.append(0)
            output_row = list(outoput_empty)
            output_row[classes.index(document[1])] = 1
            training.append([bag,output_row])
        random.shuffle(training)
        training = np.array(training, dtype="object")

        train_x = list(training[:,0])
        train_y = list(training[:,1])

        model = Sequential()
        model.add(Dense(128, input_shape=(len(train_x[0]),),activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(64,activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(len(train_y[0]),activation='softmax'))

        sgd = SGD(learning_rate=0.001,decay=1e-6,momentum=0.9,nesterov=True)
        model.compile(loss='categorical_crossentropy',optimizer=sgd,metrics=['accuracy'])

        print("comienza el entrenamiento")
        train_process = model.fit(np.array(train_x),np.array(train_y),epochs=setting.epoch,batch_size=setting.batchsize,verbose=1)
        model.save("chatbot_model.h5",train_process)
        print("modelo entrenado")

        return JsonResponse(dict(success=True, tipo="success",mensaje="Entrenado"), safe=False)
    except Exception as e:
        print(e.args[0])
        return JsonResponse(dict(success=False,tipo="error", mensaje=e.args[0], data=None))
    

@login_required
def insert(request):
    try:
        dicc = json.load(request)['req']
        if dicc['intent']['id'] == "":
            del dicc['intent']["id"]
            intent = Intent.objects.create(**dicc['intent'])
            for p in dicc['patterns']:
                del p["id"]
                p["fkintent"] =  intent
                Pattern.objects.create(**p)
            for r in dicc['responses']:
                del r["id"]
                r["fkintent"] =  intent
                Response.objects.create(**r)
        else:
            print("else")

        lista = list(Intent.objects.all().values('id','tag'))
        return JsonResponse(dict(success=True, tipo="success",mensaje="Registrado Correctamente", data= lista), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def update(request):
    try:
        dicc = json.load(request)['obj']
        Intent.objects.filter(pk=dicc["id"]).update(**dicc)

        lista = list(Intent.objects.all().values('id','tag'))
        return JsonResponse(dict(success=True, tipo="success",mensaje="Modificado Correctamente", data= lista), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def delete(request,id):
    try:
        Intent.objects.filter(id=id).delete()
        lista = list(Intent.objects.all().values('id','tag'))
        return JsonResponse(dict(success=True, tipo="success", mensaje="Eliminado Correctamente", data=lista),
                            safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def obtenerRespuestas(request,id):
    try:

        obj= {'patterns':list(Pattern.objects.filter(fkintent=id).all().values('id','message')),
        'responses':list(Response.objects.filter(fkintent=id).all().values('id','message'))}
        return JsonResponse(dict(success=True, tipo="success",mensaje="Correcto", data= obj), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def insertPattern(request):
    try:
        dicc = json.load(request)['obj']
        del dicc["id"]
        dicc["fkintent"] = Intent.objects.get(id=int(dicc["fkintent"]))
        Pattern.objects.create(**dicc)
        return JsonResponse(dict(success=True, tipo="success",mensaje="Registrado Correctamente"), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False) 
@login_required
def updatePattern(request):
    try:
        dicc = json.load(request)['obj']
        Pattern.objects.filter(pk=dicc["id"]).update(**dicc)
        return JsonResponse(dict(success=True, tipo="success",mensaje="Patron Modificado Correctamente"), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def deletePattern(request,id):
    try:
        Pattern.objects.filter(id=id).delete()
        return JsonResponse(dict(success=True, tipo="success", mensaje="Eliminado Correctamente"),
                            safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def insertResponse(request):
    try:
        dicc = json.load(request)['obj']
        del dicc["id"]
        dicc["fkintent"] = Intent.objects.get(id=int(dicc["fkintent"]))
        Response.objects.create(**dicc)
        return JsonResponse(dict(success=True, tipo="success",mensaje="Registrado Correctamente"), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def updateResponse(request):
    try:
        dicc = json.load(request)['obj']
        Response.objects.filter(pk=dicc["id"]).update(**dicc)

        return JsonResponse(dict(success=True, tipo="success",mensaje="Respuesta Modificada Correctamente"), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)
@login_required
def deleteResponse(request,id):
    try:
        Response.objects.filter(id=id).delete()
        return JsonResponse(dict(success=True, tipo="success", mensaje="Eliminado Correctamente"),
                            safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False, tipo="error", mensaje=e.args[0]), safe=False)