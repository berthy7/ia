from django.urls import path

from system.login import views


urlpatterns = [
path('', views.index, name='index'),
path('logon/', views.logon, name='logon'),
path('logout/', views.signout, name='logout'),
]