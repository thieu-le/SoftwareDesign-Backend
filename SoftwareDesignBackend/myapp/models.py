from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils.translation import gettext as _
from django.core.management.base import BaseCommand

# Your models go here


class UserCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


class State(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=10, null=True)  # Allow NULL values for abbreviation

    def __str__(self):
        return self.name
class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, default="")
    address1 = models.CharField(max_length=255, default="")
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, default="")
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    zipcode = models.CharField(max_length=10, default="")

    def __str__(self):
        return self.full_name

class FuelQuote(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    gallons_requested = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    delivery_date = models.DateField()
    suggested_price_per_gallon = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)