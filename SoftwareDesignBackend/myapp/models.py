from django.db import models
from django.contrib.auth.models import User

class ClientProfile(models.Model):
    # Define fields for the ClientProfile model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255, default="N/A")
    full_name = models.CharField(max_length=255, default="")
    address1 = models.CharField(max_length=255, default="")
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, default="")
    state = models.CharField(max_length=2, default="")
    zipcode = models.CharField(max_length=10, default="")

    # Add any additional fields as needed for the client profile

    def __str__(self):
        return self.full_name

class FuelQuote(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    gallons_requested = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_date = models.DateField()
    suggested_price_per_gallon = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
