from django.shortcuts import render, HttpResponse, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import ClientProfile, FuelQuote  # Import FuelQuote model
from .serializers import ClientProfileSerializer
from django.contrib.auth.decorators import login_required  # Import login_required decorator

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
        return HttpResponseNotAllowed(['POST'])

def index(request):
    return HttpResponse("Hello, world. This is the index page.")

def create_client_profile(request):
    if request.method == 'POST':
        serializer = ClientProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

def get_client_profile(request, profile_uuid): 
    profile = get_object_or_404(ClientProfile, pk=profile_uuid)
    serializer = ClientProfileSerializer(profile)
    return JsonResponse(serializer.data)

def update_client_profile(request, profile_uuid):  
    profile = get_object_or_404(ClientProfile, pk=profile_uuid)
    if request.method == 'PUT':
        serializer = ClientProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Only PUT method is allowed'}, status=405)

def delete_client_profile(request, profile_uuid):  
    profile = get_object_or_404(ClientProfile, pk=profile_uuid)
    profile.delete()
    return JsonResponse({'message': 'Client profile deleted successfully'}, status=204)

# Define the fuel_quote_form function
@login_required
def fuel_quote_form(request):
    if request.method == 'POST':
        # Handle form submission and calculations (not shown)
        pass
    return render(request, 'fuel_quote_form.html')

# Define the quote_history function
@login_required
def quote_history(request):
    client_quotes = FuelQuote.objects.filter(client=request.user.clientprofile)
    return render(request, 'quote_history.html', {'client_quotes': client_quotes})
