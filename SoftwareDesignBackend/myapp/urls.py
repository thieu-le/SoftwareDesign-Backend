from django.urls import path
from .views import login_view, index, create_client_profile, get_client_profile, update_client_profile, delete_client_profile, register_view
from .views import fuel_quote_form, quote_history  # Import fuel quote views
from .import views

urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('profile/', create_client_profile, name='create_client_profile'),
    path('profile/<uuid:profile_uuid>/', get_client_profile, name='get_client_profile'),
    path('profile/<uuid:profile_uuid>/update/', update_client_profile, name='update_client_profile'),
    path('profile/<uuid:profile_uuid>/delete/', delete_client_profile, name='delete_client_profile'),

    
    # Add fuel quote URLs
    path('fuel-quote/', fuel_quote_form, name='fuel_quote_form'),
    path('fuelquotehistory/', views.fuel_quote_history, name='fuel_quote_history'),
    path('quote-history/', quote_history, name='quote_history'),
]
