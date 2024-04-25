from django.shortcuts import render, HttpResponse, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponseNotAllowed,HttpResponseRedirect
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


def csrf_token_view(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=400)
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def index(request):
    return HttpResponse("Hello, world. This is the index page.")

def create_client_profile(request):
    print(request.POST)
    if request.method == 'POST':
        user = request.user
        print(user)
        serializer = ClientProfileSerializer(data=request.POST)
        if not serializer.is_valid():
            print("Serializer is not valid")
            print(serializer.errors)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
# @login_required
# def create_client_profile(request):
#     print(request.POST)
#     if request.method == 'POST':
#         user = request.user
#         profile_data = request.POST.copy()  # Create a mutable copy of the POST data
        
#         # Remove the 'user' field from the form data
#         profile_data.pop('user', None)
        
#         # Add the user's primary key to the data
#         profile_data['user'] = user.pk  

#         serializer = ClientProfileSerializer(data=profile_data)
        
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
#         return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     return JsonResponse({'error': 'Only POST method is allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
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
            # Extract form data safely
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            if username and password:
                # Create User instance
                user = User.objects.create_user(username=username, password=password)
                # Create UserCredentials instance and link it to the user
                user_credentials = UserCredentials.objects.create(user=user, password=password)
                # Return a JSON response indicating successful registration
                return JsonResponse({'message': 'Registration successful'}, status=200)
            else:
                # Handle the case where form data is missing
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
    try:
        # Example of how to get data from request.POST
        profile_uuid = request.POST.get('profile_uuid')
        profile = get_object_or_404(ClientProfile, pk = profile_uuid)
        serializer = ClientProfileSerializer(profile)

        user_profile = request.user.clientprofile
        gallons_requested = float(request.POST['gallons_requested'])
        delivery_date = request.POST['delivery_date']

        quote_data = calculate_fuel_quote_service(user_profile,gallons_requested, delivery_date)

        gallons_requested = float(request.POST['gallons_requested'])
        delivery_date = request.POST['delivery_date']
        # Call the service function to calculate the fuel quote
        quote_data = calculate_fuel_quote_service(gallons_requested, delivery_date)

        response_data = {
            'client_profile': serializer.data,
            'quote_data': quote_data
        }


        return JsonResponse(response_data)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    



# Define the quote_history function
@login_required
def quote_history(request):
    client_quotes = FuelQuote.objects.filter(client=request.user.clientprofile)
    print(request)
    # return render(request, 'quote_history.html', {'client_quotes': client_quotes})
    return JsonResponse(request)

def get_csrf_token(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    # Return the CSRF token in a JSON response
    return JsonResponse({'csrfToken': csrf_token})
