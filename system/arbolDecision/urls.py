from django.urls import path
from system.arbolDecision import views

urlpatterns = [
    path('', views.index, name='arbolDecision'),
    path('entrenar/', views.entrenar, name='arbolDecision_entrenar'),
]