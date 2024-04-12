from django.shortcuts import render, HttpResponse, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import ClientProfile, FuelQuote, State  # Import FuelQuote model
from .serializers import ClientProfileSerializer
from django.contrib.auth.decorators import login_required  # Import login_required decorator
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .forms import RegistrationForm
from .models import UserCredentials

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
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        print("POST data:", request.POST)  # Debugging statement to print POST data
        if form.is_valid():
            # Extract form data safely
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            print("Extracted username:", username)  # Debugging statement to print extracted username

            if username and password:
                # Print the username for debugging purposes
                print("Received username:", username)
                
                # Create User instance
                user = User.objects.create_user(username=username, password=password)
                
                # Create UserCredentials instance and link it to the user
                user_credentials = UserCredentials.objects.create(user=user, password=password)
                
                # Additional logic, such as redirecting to a success page or logging in the user
                return HttpResponseRedirect('/success/')
            else:
                # Handle the case where form data is missing
                # For example, you can render the form again with an error message
                return render(request, 'register.html', {'form': form, 'error_message': 'Missing form data'})
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})



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
