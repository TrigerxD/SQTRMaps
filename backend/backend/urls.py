"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

import App
from App.views import UserView, BlinkeeApiCitiesView, BlinkeeApiCoordinatesView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('marker/', App.views.MarkerViewAll.as_view(), name='marker'),
    path('addmarker/', App.views.MarkerViewAdd.as_view(), name='addmarker'),
    path('allmarkers/', App.views.MarkerViewAll.as_view(), name='allmarkers'),
    path('user/', UserView.as_view(), name='user'),
    path('blinkee/<slug:vehicle>/<slug:city>/', BlinkeeApiCitiesView.as_view(), name='blinkee_cities'),
    path('blinkee/<slug:vehicle>/<str:lat>/<str:lng>/', BlinkeeApiCoordinatesView.as_view(),
         name='blinkee_coordinates'),
]
