from django.shortcuts import render
from rest_framework import generics
from .models import UserProfile
from .serializers import UserProfilesSerializer

class UsersListAPIView(generics.ListAPIView):
    serializer_class = UserProfilesSerializer

    def get_queryset(self):
        return UserProfile.objects.all()


