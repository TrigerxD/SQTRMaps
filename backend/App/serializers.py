from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Marker, Company


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']


class CompanySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'address', 'marker_color']


class MarkerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Marker
        fields = ['user', 'lat', 'lng', 'insertion_date', 'company']
