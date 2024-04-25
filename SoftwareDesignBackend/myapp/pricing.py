from .models import FuelQuote, ClientProfile
def calculate_fuel_quote_service(user_profile: ClientProfile, gallons_requested: float, delivery_date: str):

    current_price_per_gallon = 1.50  # Constant
    company_profit_factor = 0.10  # Constant
    
    # state-based location factor
    location_factor = 0.02  # Example: Texas
    if user_profile.state != 'Texas':
        location_factor = 0.04  # Example: Other states
        
    # rate history factor
    rate_history_factor = 0.01 if FuelQuote.objects.filter(client=user_profile).exists() else 0
        
    # gallons requested factor
    gallons_requested = 0.02 if gallons_requested > 1000 else 0.03
        
    # Calculate margin
    margin = current_price_per_gallon * (location_factor - rate_history_factor + 
                                         gallons_requested + company_profit_factor)
        
    # Calculate suggested price
    suggested_price = current_price_per_gallon + margin
        
    # Calculate total amount due
    total_amount_due = gallons_requested * suggested_price
    
    # Return the calculated data 
    return {
        'suggestedPrice': suggested_price,
        'totalAmountDue': total_amount_due
    }