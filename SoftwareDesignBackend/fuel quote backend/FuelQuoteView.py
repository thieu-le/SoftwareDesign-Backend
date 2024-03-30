from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import FuelQuote

@login_required
def fuel_quote_form(request):
    if request.method == 'POST':
        # Handle form submission and calculations (not shown)
        pass
    return render(request, 'fuel_quote_form.html')

@login_required
def quote_history(request):
    client_quotes = FuelQuote.objects.filter(client=request.user.clientprofile)
    return render(request, 'quote_history.html', {'client_quotes': client_quotes})