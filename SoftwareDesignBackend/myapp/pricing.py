from .models import ClientProfile, FuelQuote

def calculate_fuel_quote_service(client_profile: ClientProfile, gallons_requested: float):
    current_price_per_gallon = 1.50  # Constant
    company_profit_factor = 0.10  # Constant
    
    # State-based location factor
    location_factor = 0.02 if client_profile.state == 'Texas' else 0.04
    
    # Rate history factor
    rate_history_factor = 0.01 if FuelQuote.objects.filter(client=client_profile).exists() else 0
    
    # Gallons requested factor
    gallons_requested_factor = 0.02 if gallons_requested > 1000 else 0.03
    
    # Calculate margin
    margin = current_price_per_gallon * (location_factor - rate_history_factor + gallons_requested_factor + company_profit_factor)
    
    # Calculate suggested price
    suggested_price = current_price_per_gallon + margin
    
    # Calculate total amount due
    total_amount_due = gallons_requested * suggested_price
    
    return {
        'suggestedPrice': round(suggested_price, 2),
        'totalAmountDue': round(total_amount_due, 2)
    }
