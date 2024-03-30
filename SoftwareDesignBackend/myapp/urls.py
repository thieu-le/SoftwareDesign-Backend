from django.urls import path
from .views import login_view, index, create_client_profile, get_client_profile, update_client_profile, delete_client_profile
from .views import fuel_quote_form, quote_history  # Import fuel quote views

urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'),
    path('client-profiles/', create_client_profile, name='create_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/', get_client_profile, name='get_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/update/', update_client_profile, name='update_client_profile'),
    path('client-profiles/<uuid:profile_uuid>/delete/', delete_client_profile, name='delete_client_profile'),
    
    # Add fuel quote URLs
    path('fuel-quote/', fuel_quote_form, name='fuel_quote_form'),
    path('quote-history/', quote_history, name='quote_history'),
]
