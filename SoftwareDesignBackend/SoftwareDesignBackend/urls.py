from django.urls import path, include
urlpatterns = [
    path('', include('myapp.urls')),  # Make sure this line is correctly configured
]