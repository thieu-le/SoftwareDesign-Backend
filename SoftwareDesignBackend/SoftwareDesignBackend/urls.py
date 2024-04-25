from django.urls import path, include
from myapp import views  # Import views from your app

urlpatterns = [
    path('', include('myapp.urls')),  # Make sure this line is correctly configured
    #path('admin/', admin.site.urls),
    path('login/', include("myapp.urls")),
    path('profile/', views.create_client_profile, name='create_client_profile'),  # Add URL pattern for profile creation
    path('csrf/token/', views.get_csrf_token, name='get_csrf_token'),  # Add URL pattern for fetching CSRF token
    # Add other profile-related URL patterns here if needed
]
