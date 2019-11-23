from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import MarkerSerializer, CompanySerializer, UserSerializer
from .models import Marker, Company
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
import json
from django.http import HttpResponse


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
