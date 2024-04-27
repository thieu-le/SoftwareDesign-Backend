from django.shortcuts import render, HttpResponse, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponseNotAllowed,HttpResponseRedirect,HttpResponseBadRequest
from .models import ClientProfile, FuelQuote, State  # Import FuelQuote model
from .serializers import ClientProfileSerializer
from django.contrib.auth.decorators import login_required  # Import login_required decorator
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .forms import RegistrationForm, LoginForm
from .models import UserCredentials
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.middleware.csrf import get_token
from django.urls import reverse
from .pricing import calculate_fuel_quote_service
from django.views import View
class MyView(View):
    def get(self, request):
        user_id = request.user.id
        is_authenticated = request.user.is_authenticated
        return render(request, 'my_template.html', {'user_id': user_id, 'is_authenticated': is_authenticated})
def csrf_token_view(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
def my_view(request):
    # Retrieve user ID from URL parameter
    user_id = request.GET.get('user_id')
    if user_id:
        # Render the profile page with the user ID
        return render(request, 'profile.html', {'user_id': user_id})
    else:
        # Handle case when user ID is not provided
        return HttpResponseBadRequest('User ID not found in URL parameter')



    return render(request, 'my_template.html', {'user_id': stored_user_id})
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                user_id = user.id
                request.session['user_id'] = user_id
                # Return user_id along with the message
                return JsonResponse({'message': 'Login successful', 'user_id': user_id}, status=200)
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=400)
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


def index(request):
    return HttpResponse("Hello, world. This is the index page.")
# @login_required
# @csrf_protect
def create_client_profile(request):
    if request.method == 'POST':
        serializer = ClientProfileSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)


def get_client_profile(request, profile_uuid): 
    profile = get_object_or_404(ClientProfile, pk=profile_uuid)
    serializer = ClientProfileSerializer(profile)
    return JsonResponse(serializer.data)

def fuel_quote_history(request):
    # Retrieve fuel quote history from the database
    quotes = FuelQuote.objects.all()  # Assuming FuelQuote is your model for fuel quotes

    # Serialize the fuel quote data
    fuel_quote_data = [
        {
            'gallonsRequested': quote.gallons_requested,
            'deliveryAddress': quote.delivery_address,
            'deliveryDate': quote.delivery_date,
            'suggestedPrice': quote.suggested_price_per_gallon,
            'totalAmountDue': quote.total_amount_due
        }
        for quote in quotes
    ]

    # Return the fuel quote history data as JSON response
    return JsonResponse(fuel_quote_data, safe=False)

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
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            if username and password:
                user = User.objects.create_user(username=username, password=password)
                user_credentials = UserCredentials.objects.create(user=user, username=username, password=password)
                # Return the user ID in the response
                return JsonResponse({'message': 'Registration successful', 'user_id': user.id}, status=200)
            else:
                return JsonResponse({'error': 'Missing form data'}, status=400)
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})


def delete_client_profile(request, profile_uuid):  
    profile = get_object_or_404(ClientProfile, pk=profile_uuid)
    profile.delete()
    return JsonResponse({'message': 'Client profile deleted successfully'}, status=204)

# Define the fuel_quote_form function
def fuel_quote_form(request):
    if request.user.is_authenticated:
        client_profile = {
            'full_name': request.user.clientprofile.full_name,
            'address1': request.user.clientprofile.address1,
            'address2': request.user.clientprofile.address2,
            'city': request.user.clientprofile.city,
            'state': request.user.clientprofile.state,
            'zipcode': request.user.clientprofile.zipcode,
        }
        return JsonResponse(client_profile)
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=401)




# Define the quote_history function
@login_required
def quote_history(request):
    try:
        client_profile = request.user.clientprofile
        client_quotes = FuelQuote.objects.filter(client=client_profile)
        fuel_quote_data = [
            {
                'gallonsRequested': quote.gallons_requested,
                'deliveryAddress': quote.delivery_address,
                'deliveryDate': quote.delivery_date,
                'suggestedPrice': quote.suggested_price_per_gallon,
                'totalAmountDue': quote.total_amount_due
            }
            for quote in client_quotes
        ]
        return JsonResponse(fuel_quote_data, safe=False)
    except ClientProfile.DoesNotExist:
        return JsonResponse({'error': 'User does not have a client profile'}, status=400)

def get_csrf_token(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    # Return the CSRF token in a JSON response
    return JsonResponse({'csrfToken': csrf_token})
