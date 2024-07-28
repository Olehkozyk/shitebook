from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import (
    LoginSerializer,
    UserProfilesSerializer,
    RegisterSerializer,
    UserSerializer
)
from rest_framework import status, generics

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,  # new
)

UserModel = get_user_model()


# List view
class UserProfileListView(ListAPIView):
    serializer_class = UserProfilesSerializer
    queryset = UserProfile.objects.all()


# Retrieve view
class UserProfileRetrieveView(RetrieveAPIView):
    serializer_class = UserProfilesSerializer
    queryset = UserProfile.objects.all()


# Update view
class UserProfileUpdateView(UpdateAPIView):
    serializer_class = UserProfilesSerializer
    queryset = UserProfile.objects.all()


class UserLogin(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            response_data = {
                'status': True,
                'data': data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            response_data = {
                'status': False,
                'errors': serializer.errors
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class UserRegister(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            response_data = {
                'status': True,
                'data': data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {
                'status': False,
                'errors': serializer.errors
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        response_data = {
            'status': True,
            'data': serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

