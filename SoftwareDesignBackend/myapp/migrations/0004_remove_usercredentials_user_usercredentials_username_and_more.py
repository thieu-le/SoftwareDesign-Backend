# Generated by Django 5.0.3 on 2024-04-12 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_state_alter_fuelquote_gallons_requested_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usercredentials',
            name='user',
        ),
        migrations.AddField(
            model_name='usercredentials',
            name='username',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='usercredentials',
            name='password',
            field=models.CharField(max_length=100),
        ),
    ]
