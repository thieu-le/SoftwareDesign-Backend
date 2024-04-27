from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import ClientProfile, FuelQuote
from .forms import RegistrationForm, LoginForm
from .serializers import ClientProfileSerializer
from unittest.mock import MagicMock, patch


class ViewsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_my_view(self):
        response = self.client.get(reverse('my-view'))
        self.assertEqual(response.status_code, 200)

    def test_csrf_token_view(self):
        response = self.client.get(reverse('csrf_token'))
        self.assertEqual(response.status_code, 200)

    def test_login_view_get(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_login_view_post_valid(self):
        form_data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(reverse('login'), form_data)
        self.assertEqual(response.status_code, 302)  # Redirect upon successful login

    def test_login_view_post_invalid(self):
        form_data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(reverse('login'), form_data)
        self.assertEqual(response.status_code, 200)  # Login failed, should return to login page

    def test_register_view_get(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)

    def test_register_view_post_valid(self):
        form_data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(reverse('register'), form_data)
        self.assertEqual(response.status_code, 302)  # Redirect upon successful registration

    def test_register_view_post_invalid(self):
        form_data = {'username': '', 'password': ''}
        response = self.client.post(reverse('register'), form_data)
        self.assertEqual(response.status_code, 200)  # Registration failed, should return to register page

    def test_index(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_create_client_profile_valid(self):
        form_data = {'full_name': 'John Doe', 'address1': '123 Main St', 'city': 'City', 'state': 1, 'zipcode': '12345'}
        response = self.client.post(reverse('create_client_profile'), form_data)
        self.assertEqual(response.status_code, 201)  # Created

    def test_create_client_profile_invalid(self):
        response = self.client.post(reverse('create_client_profile'), {})
        self.assertEqual(response.status_code, 400)  # Bad request

    def test_get_client_profile(self):
        profile = ClientProfile.objects.create(user=self.user)
        response = self.client.get(reverse('get_client_profile', args=[profile.id]))  # Using 'id'
        self.assertEqual(response.status_code, 200)

    def test_fuel_quote_history(self):
        FuelQuote.objects.create()  # Create sample data
        response = self.client.get(reverse('quote_history'))  # Using 'quote_history'
        self.assertEqual(response.status_code, 200)

    def test_update_client_profile_valid(self):
        profile = ClientProfile.objects.create(user=self.user)
        form_data = {'full_name': 'Updated Name'}
        response = self.client.put(reverse('update_client_profile', args=[profile.id]), form_data)  # Using 'id'
        self.assertEqual(response.status_code, 200)

    def test_update_client_profile_invalid(self):
        profile = ClientProfile.objects.create(user=self.user)
        response = self.client.put(reverse('update_client_profile', args=[profile.id]), {})
        self.assertEqual(response.status_code, 400)  # Bad request

    @patch('myapp.views.calculate_fuel_quote_service')
    def test_fuel_quote_form_valid(self, mock_calculate_fuel_quote_service):
        mock_calculate_fuel_quote_service.return_value = {'quote_data': 'mocked_data'}
        form_data = {'profile_uuid': 'profile_uuid', 'gallons_requested': 100, 'delivery_date': '2024-05-01'}
        response = self.client.post(reverse('calculate_fuel_quote'), form_data)  # Using 'calculate_fuel_quote'
        self.assertEqual(response.status_code, 200)

    @patch('myapp.views.calculate_fuel_quote_service')
    def test_fuel_quote_form_invalid(self, mock_calculate_fuel_quote_service):
        mock_calculate_fuel_quote_service.side_effect = Exception('Mocked exception')
        response = self.client.post(reverse('calculate_fuel_quote'), {})
        self.assertEqual(response.status_code, 400)  # Bad request

    def test_quote_history(self):
        self.client.force_login(self.user)  # Ensure user is logged in
        response = self.client.get(reverse('quote_history'))
        self.assertEqual(response.status_code, 405)  # Method not allowed for authenticated users

    def test_get_csrf_token(self):
        response = self.client.get(reverse('csrf_token'))
        self.assertEqual(response.status_code, 200)
