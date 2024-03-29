from django.urls import path
from views import login_view, index

urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'),
]
