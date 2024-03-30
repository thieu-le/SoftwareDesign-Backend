from django.urls import path
from . import views

urlpatterns = [
    path('fuel-quote/', views.fuel_quote_form, name='fuel_quote_form'),
    path('quote-history/', views.quote_history, name='quote_history'),
]
