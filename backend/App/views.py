from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import MarkerSerializer, CompanySerializer, UserSerializer
from .models import Marker, Company
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core import serializers
import json
from django.http import HttpResponse


# Create your views here.


class MarkerViewAdd(APIView):
    permission_classes = [AllowAny]

    def post(self, *args, **kwargs):
        received_json_data = json.loads(self.request.body)
        lat = received_json_data['lat']
        lng = received_json_data['lng']
        # company = received_json_data['company']
        marker = Marker(lat=lat, lng=lng)
        marker.save()
        return HttpResponse(status=200)


class MarkerViewAll(APIView):
    permission_classes = (IsAuthenticated,)

    # zwraca wszystkie zapisane markery
    def get(self, *args, **kwargs):
        queryset = Marker.objects.all()
        serialized_qs = serializers.serialize('json', queryset)
        content = {'message': serialized_qs}
        return Response(content)


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
