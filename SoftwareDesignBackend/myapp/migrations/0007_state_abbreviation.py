# Generated by Django 5.0.3 on 2024-04-25 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_alter_state_options_remove_clientprofile_address_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='state',
            name='abbreviation',
            field=models.CharField(max_length=10, null=True),
        ),
    ]