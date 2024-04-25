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

@csrf_protect
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
                #return HttpResponseRedirect('/success/')
                return redirect('login')
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
        gallons_requested = float(request.POST['gallons_requested'])
        delivery_date = request.POST['delivery_date']
        current_price_per_gallon = 1.50  # Constant
        company_profit_factor = 0.10  # Constant
        
        # Get user's profile information
        user_profile = ClientProfile.objects.get(user=request.user)
        location_factor = 0.02 if user_profile.state.name == 'Texas' else 0.04
        
        # Check rate history
        rate_history_factor = 0.01 if FuelQuote.objects.filter(client=user_profile).exists() else 0
        
        # Calculate gallons requested factor
        gallons_requested_factor = 0.02 if gallons_requested > 1000 else 0.03
        
        # Calculate margin
        margin = current_price_per_gallon * (location_factor - rate_history_factor + gallons_requested_factor + company_profit_factor)
        
        # Calculate suggested price
        suggested_price = current_price_per_gallon + margin
        
        # Create a new fuel quote instance
        new_fuel_quote = FuelQuote(client=user_profile, gallons_requested=gallons_requested, 
                                   delivery_date=delivery_date, suggested_price_per_gallon=suggested_price, 
                                   total_amount_due=gallons_requested * suggested_price)
        new_fuel_quote.save()
        
        return redirect('fuel_quote_list')  # Redirect to fuel quote list page or wherever you want
    else:
        return render(request, 'fuel_quote_form.html')

# Define the quote_history function
@login_required
def quote_history(request):
    client_quotes = FuelQuote.objects.filter(client=request.user.clientprofile)
    return render(request, 'quote_history.html', {'client_quotes': client_quotes})

def get_csrf_token(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    # Return the CSRF token in a JSON response
    return JsonResponse({'csrfToken': csrf_token})
