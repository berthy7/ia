from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login,logout, authenticate
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

def logon(request):
    dicc = json.load(request)['obj']
    user = authenticate(request,username=dicc['username'],password=dicc['password'])
    if user is None:
        return render(request, 'index.html')
    else:
        login(request,user)
        return JsonResponse(dict(success=True,message =""), safe=False)

def signout(request):
    logout(request)
    return redirect('home')