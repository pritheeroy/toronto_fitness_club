import re

from django.core.exceptions import ValidationError
from django.db import models


# Create your models here.
class Studio(models.Model):
    name = models.CharField(max_length=150, blank=False)
    address = models.CharField(max_length=150, blank=False)
    location_lat = models.DecimalField(default=0, max_digits=10, decimal_places=6, verbose_name='Location (Latitude)', blank=False)
    location_long = models.DecimalField(default=0, max_digits=10, decimal_places=6, verbose_name='Location (Longitude)', blank=False)
    postal_code = models.CharField(max_length=10, blank=False)
    phone_num = models.CharField(max_length=20, blank=False)

    def __str__(self):
        return self.name.title()

    def clean(self):
        if self.location_lat < -90 or self.location_lat > 90 or self.location_long < -180 or self.location_long > 180:
            raise ValidationError("Enter a valid geolocation.")

        postal_code_pattern = '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'
        phone_pattern = '^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$'

        match = re.match(phone_pattern, self.phone_num)
        if not match:
            raise ValidationError("Enter a valid phone number.")

        match = re.match(postal_code_pattern, self.postal_code)
        if not match:
            raise ValidationError("Enter a valid postal code.")


class Amenity(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return self.studio.name.title() + " - " + self.type.title()


class Image(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/', null=True)
