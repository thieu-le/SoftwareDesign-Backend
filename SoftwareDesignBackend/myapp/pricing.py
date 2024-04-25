from .models import FuelQuote, ClientProfile

def calculate_fuel_quote_service(user_profile: ClientProfile, gallons_requested: float, delivery_date: str):
    current_price_per_gallon = 1.50  # Constant
    company_profit_factor = 0.10  # Constant
    
    # Location Factor
    if user_profile.state.name == 'Texas':
        location_factor = 0.02
    else:
        location_factor = 0.04
    
    # Rate History Factor
    rate_history_factor = 0.01 if FuelQuote.objects.filter(client=user_profile).exists() else 0
    
    # Gallons Requested Factor
    gallons_requested_factor = 0.02 if gallons_requested > 1000 else 0.03
    
    # Calculate Margin
    margin = current_price_per_gallon * (location_factor + rate_history_factor + gallons_requested_factor + company_profit_factor)
    
    # Calculate Suggested Price
    suggested_price = current_price_per_gallon + margin
    
    # Calculate Total Amount Due
    total_amount_due = gallons_requested * suggested_price
    
    return {
        'suggestedPrice': suggested_price,
        'totalAmountDue': total_amount_due
    }
