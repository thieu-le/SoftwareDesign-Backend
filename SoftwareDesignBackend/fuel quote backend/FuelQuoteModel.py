from django.db import models
from django.contrib.auth.models import User

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)

class FuelQuote(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    gallons_requested = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_date = models.DateField()
    suggested_price_per_gallon = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
