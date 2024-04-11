# Generated by Django 5.0.3 on 2024-04-09 04:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ClientProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(default='N/A', max_length=255)),
                ('full_name', models.CharField(default='', max_length=255)),
                ('address1', models.CharField(default='', max_length=255)),
                ('address2', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(default='', max_length=100)),
                ('state', models.CharField(default='', max_length=2)),
                ('zipcode', models.CharField(default='', max_length=10)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FuelQuote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gallons_requested', models.DecimalField(decimal_places=2, max_digits=10)),
                ('delivery_date', models.DateField()),
                ('suggested_price_per_gallon', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total_amount_due', models.DecimalField(decimal_places=2, max_digits=10)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.clientprofile')),
            ],
        ),
        migrations.DeleteModel(
            name='TodoItem',
        ),
    ]