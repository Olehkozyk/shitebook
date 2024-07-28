from django.db.models import Q
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from .models import UserProfile
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

UserModel = get_user_model()

class UserProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        login = data.get('login')
        password = data.get('password')

        if login and password:
            user = User.objects.filter(Q(username=login) | Q(email=login)).first()
            if user:
                user = authenticate(username=user.username, password=password)
                if not user.is_active:
                    raise serializers.ValidationError('User is deactivated.')

                token = RefreshToken.for_user(user)

                return {
                    'user': user.username,
                    'refresh': str(token),
                    'access': str(token.access_token),
                }
            else:
                raise serializers.ValidationError('Invalid credentials.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')



class RegisterSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'repeat_password', 'email')
        extra_kwargs = {
            'password': {'write_only': True},
            'repeat_password': {'write_only': True},
        }

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        repeat_password = data.get('repeat_password')

        if not username:
            raise serializers.ValidationError({'username': 'This field is required.'})
        if not email:
            raise serializers.ValidationError({'email': 'This field is required.'})
        if not password:
            raise serializers.ValidationError({'password': 'This field is required.'})
        if not repeat_password:
            raise serializers.ValidationError({'repeat_password': 'This field is required.'})
        if password != repeat_password:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is already taken.')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email is already taken.')
        if password != repeat_password:
            raise serializers.ValidationError('Passwords do not match.')

        return data

    def create(self, validated_data):
        validated_data.pop('repeat_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        refresh = RefreshToken.for_user(user)
        return {
            'user': user.username,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')