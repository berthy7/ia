from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from system.chatBot.models import Intent,Pattern,Response
# Create your views here.


@login_required
def home(request):

    obj= {'datos':{'lista':list(Intent.objects.all().values('id','tag'))}}

    return render(request, 'home.html',obj)





