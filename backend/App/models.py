from django.db import models
from django.utils import timezone


# Create your models here.

class Company(models.Model):
    name = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200, null=True)
    marker_color = models.CharField(max_length=30, null=True)


class Marker(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    lat = models.FloatField(null=False, default=None)
    lng = models.FloatField(null=False, default=None)
    insertion_date = models.DateTimeField(default=timezone.now)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.insertion_date = timezone.now()
        return super(Marker, self).save(*args, **kwargs)
