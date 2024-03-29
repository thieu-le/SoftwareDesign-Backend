from django.db import models

class ClientProfile(models.Model):
    # Define fields for the ClientProfile model
    full_name = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)  # Assuming state abbreviations like 'NY', 'CA', etc.
    zipcode = models.CharField(max_length=10)  # Assuming ZIP code format like '12345'

    # Add any additional fields as needed for the client profile

    def __str__(self):
        return self.full_name
