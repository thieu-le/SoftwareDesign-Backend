from django.urls import path
from .views import (
    login_view, index, create_client_profile, get_client_profile, 
    update_client_profile, delete_client_profile, register_view, 
    csrf_token_view, MyView, fuel_quote_form, quote_history
)

urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('client-profiles/', create_client_profile, name='create_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/', get_client_profile, name='get_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/update/', update_client_profile, name='update_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/delete/', delete_client_profile, name='delete_client_profile'),
    path('csrf/token/', csrf_token_view, name='csrf_token'),
    path('profile/', create_client_profile, name='create_client_profile'),
    path('my-view/', MyView.as_view(), name='my-view'),
<<<<<<< HEAD
    path('calculateFuelQuote/', fuel_quote_form, name='calculate_fuel_quote'),
=======
    # Add fuel quote URLs
    path('fuel_quote_form/', fuel_quote_form, name='fuel_quote_form'),
>>>>>>> 803aecba349f590a3d5c75a56ce02fbece35d949
    path('quote-history/', quote_history, name='quote_history'),
]
