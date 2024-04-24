from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import json
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier,DecisionTreeRegressor
from sklearn.model_selection import train_test_split

from sklearn import metrics
from sklearn import preprocessing
import matplotlib.pyplot as plt
from io import StringIO
import pydotplus

import matplotlib.image as mpimg
from sklearn import tree



@login_required
def index(request):
    return render(request, 'arbolDecision/index.html')


@login_required
def entrenar(request):
    try:

        df = pd.read_excel('static/files/data.xlsx')

        nroColumnas = df.shape[1]

        caracteristicas = []
        respuestas = []
        contador = 1
        for i in df.columns[0:nroColumnas]:
            if contador < nroColumnas:
                caracteristicas.append(i)
            else:
                respuestas.append(i)
            contador = contador +1


        x = df[caracteristicas].values
        y = df[respuestas].values

        #x = df[['Temperature','Exhast_Vaccum','Ambiant_Pressure','Relative_Humidity']].values
        #y = df[['Energy_Output']].values


        #tem = preprocessing.LabelEncoder()
        #x[:,0] = tem.transform(x[:,0])

        #hast = preprocessing.LabelEncoder()
        #x[:,1] = hast.transform(x[:,1])

        #res = preprocessing.LabelEncoder()
        #x[:,2] = res.transform(x[:,2])

        #midi = preprocessing.LabelEncoder()
        #x[:,3] = midi.transform(x[:,3])

        #label_encoder = preprocessing.LabelEncoder()
        #x = label_encoder.fit_transform(x)



        x_entre, x_test, y_entre,y_test = train_test_split(x,y,test_size=0.3,random_state=3)
        arbol = DecisionTreeRegressor()

        #label_encoder = preprocessing.LabelEncoder()

        #train_X = label_encoder.fit_transform(x_entre)
        #train_Y = label_encoder.fit_transform(y_entre)

        #train_X = train_X.reshape(-1, 1)
        #train_Y = train_Y.reshape(-1, 1)

        arbol.fit(x_entre,y_entre)

        print("2")
        arbolpred = arbol.predict(x_test)
        print("3")
        #print("presicion de arbol: ",metrics.accuracy_score(y_test, arbolpred))



        dot_data = StringIO()
        filename = "arbol.png"
        featureNames = df.columns[0:nroColumnas-1]
        targetName = df["Energy_Output"].unique().tolist()
        out = tree.export_graphviz(arbol,feature_names=featureNames,out_file=dot_data,class_names=np.unique(y_entre),filled=True,)

        graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
        graph.write_png(filename)



        
        img = mpimg.imread(filename)
        plt.figure(figsize=(100,200))
        plt.imshow(img,interpolation='nearest')




        return JsonResponse(dict(success=True, tipo="success",mensaje="Correcto"), safe=False)
    except Exception as e:
        print(e.args[0])
        return JsonResponse(dict(success=False,tipo="error", mensaje=e.args[0], data=None))
