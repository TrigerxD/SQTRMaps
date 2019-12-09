import urllib.request

from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core import serializers

from backend.remove_regional_chars import remove_regional_chars
from .serializers import MarkerSerializer, CompanySerializer, UserSerializer
from .models import Marker, Company
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core import serializers
import json
from django.http import HttpResponse, JsonResponse


# Create your views here.


class MarkerViewAll(APIView):
    permission_classes = (IsAuthenticated,)

    # zwraca wszystkie zapisane markery
    def get(self, *args, **kwargs):
        queryset = Marker.objects.all()
        serialized_qs = serializers.serialize('json', queryset)
        content = {'message': serialized_qs}
        return Response(content)

    def post(self, *args, **kwargs):
        received_json_data = json.loads(self.request.body)
        content = received_json_data['data']
        lat = content['lat']
        lng = content['lng']
        # company = content['company']
        user = self.request.user
        marker = Marker(user=user, lat=lat, lng=lng)
        marker.save()
        # serialized_obj = serializers.serialize('json', [marker, ])
        # content = {'message': serialized_obj}
        return HttpResponse(status=200)


class UserView(APIView):
    permission_classes = [AllowAny]

    def post(self, *args, **kwargs):
        content = self.request.data
        username = content['username']
        password = content['password']
        email = content['email']
        if User.objects.filter(username=username).exists():
            return HttpResponse(status=409)

        User.objects.create_user(username=username, password=password, email=email)
        return HttpResponse(status=201)


def merge_all_coordinates_lists(coordinates_json):
    area = coordinates_json['area']
    coordinates_list = area['coordinates']
    merged_coordinates_list = list()

    for nested_coordinate_list in coordinates_list:
        for nested_coordinate_list2 in nested_coordinate_list:
            for coordinate in nested_coordinate_list2:
                merged_coordinates_list.append({'lat': coordinate[0], 'lng': coordinate[1]})

    return merged_coordinates_list


class BlinkeeApiCitiesView(APIView):
    permission_classes = (IsAuthenticated,)
    url = 'http://blinkee.city/api/regions'

    def get(self, *args, **kwargs):

        coordinates = ''
        with urllib.request.urlopen(self.url) as response:
            blinkee_data = json.loads(response.read())
            for blinkee_city in blinkee_data:
                if remove_regional_chars(blinkee_city['name']) == kwargs['city']:
                    zones = blinkee_city['zones']
                    if kwargs['vehicle'] == 'scooters':
                        coordinates = merge_all_coordinates_lists(zones[1])
                    elif kwargs['vehicle'] == 'motor_scooters':
                        coordinates = merge_all_coordinates_lists(zones[0])

        if coordinates != '':
            return Response(coordinates, status=200)
        else:
            return Response(status=404)


def is_fit_in_bounds(blinkee_city, lat, lng):
    min_lng, min_lat, max_lng, max_lat = blinkee_city['bounds']
    border_scooter_in_city_650m = 0.005

    if min_lat - border_scooter_in_city_650m <= lat <= max_lat + border_scooter_in_city_650m:
        if min_lng - border_scooter_in_city_650m <= lng <= max_lng + border_scooter_in_city_650m:
            return True

    return False


class BlinkeeApiCoordinatesView(APIView):
    permission_classes = (IsAuthenticated,)
    url = 'http://blinkee.city/api/regions'

    def get(self, *args, **kwargs):
        lat = kwargs['lat']
        lng = kwargs['lng']

        if not lat.replace(".", "", 1).isdigit():
            return Response(status=400)

        if not lng.replace(".", "", 1).isdigit():
            return Response(status=400)

        lat = float(lat)
        lng = float(lng)

        coordinates = ''
        with urllib.request.urlopen(self.url) as response:
            blinkee_data = json.loads(response.read())
            for blinkee_city in blinkee_data:
                if is_fit_in_bounds(blinkee_city, lat, lng):
                    zones = blinkee_city['zones']
                    if kwargs['vehicle'] == 'scooters':
                        coordinates = merge_all_coordinates_lists(zones[1])
                    elif kwargs['vehicle'] == 'motor_scooters':
                        coordinates = merge_all_coordinates_lists(zones[0])

        if coordinates != '':
            return Response(coordinates, status=200)
        else:
            return Response(status=404)
