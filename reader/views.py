from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import datetime

# Create your views here.

def showtime(request):
    return render_to_response("index.html")
