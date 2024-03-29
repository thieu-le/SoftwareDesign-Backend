from django.shortcuts import render, HttpResponse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponseNotAllowed

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
    else:
        # If the request method is not POST, return a 405 Method Not Allowed response
        return HttpResponseNotAllowed(['POST'])

def index(request):
    return HttpResponse("Hello, world. This is the index page.")