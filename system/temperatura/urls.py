from django.urls import path
from system.temperatura import views

urlpatterns = [
    path('', views.index, name='temperatura'),
    path('convertir/<int:gradoCentigrado>/', views.convertir, name='temperatura_convertir'),
]