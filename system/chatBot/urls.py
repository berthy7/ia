from django.urls import path
from system.chatBot import views

urlpatterns = [
    path('', views.index, name='chatBot'),
    path('entrenar/', views.entrenar, name='chatBot_entrenar'),
    path('mensaje/<str:mensaje>/', views.mensaje, name='chatBot_mensaje'),
    path('insert/', views.insert, name='chatBot_insert'),
    path('update/', views.update, name='chatBot_update'),
    path('insertPattern/', views.insertPattern, name='chatBot_insertPattern'),
    path('insertResponse/', views.insertResponse, name='chatBot_insertResponse'),
    path('updatePattern/', views.updatePattern, name='chatBot_updatePattern'),
    path('updateResponse/', views.updateResponse, name='chatBot_updateResponse'),
    path('deletePattern/<int:id>/', views.deletePattern, name='chatBot_deletePattern'),
    path('deleteResponse/<int:id>/', views.deleteResponse, name='chatBot_deleteResponse'),
    path('delete/<int:id>/', views.delete, name='chatBot_delete'),
    path('obtenerRespuestas/<int:id>/', views.obtenerRespuestas, name='chatBot_obtenerRespuestas'),
]