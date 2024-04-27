from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User,Group

import json
import datetime

import tensorflow as tf
import numpy as np

@login_required
def index(request):
    return render(request, 'temperatura/index.html')


@login_required
def convertir(request,gradoCentigrado):
    try:

        celsius = np.array([-40,-10,0,8,15,22,38], dtype= float)
        fahrenheit = np.array([-40,14,32,46,59,72,100], dtype= float)

        capa = tf.keras.layers.Dense(units=1,input_shape=[1])
        modelo = tf.keras.Sequential([capa])

        modelo.compile(
            optimizer= tf.keras.optimizers.Adam(0.1),
            loss = 'mean_squared_error'
        )

        print("comienza el entrenamiento")
        historial = modelo.fit(celsius,fahrenheit,epochs=200,verbose= 1)
        print("modelo entrenado")

        resultado = modelo.predict(x=np.array([gradoCentigrado])).tolist()

        return JsonResponse(dict(success=True, tipo="success",mensaje="ejecutado Correctamente", data=resultado), safe=False)
    except Exception as e:
        return JsonResponse(dict(success=False,tipo="error", mensaje=e.args[0], data=None))
