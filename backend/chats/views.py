from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Chat
from django.contrib.auth.models import User
from .serializers import ChatSerializer


class ChatsItemAPIView(APIView):
    serializer_class = ChatSerializer

    def get(self, request, id_user):
        try:
            user = get_object_or_404(User, id=id_user)
            chats = Chat.objects.filter(Q(user1=user) | Q(user2=user))
        except Chat.DoesNotExist:
            return Response('Not found', status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(chats, many=True)
        return Response(serializer.data)

class ChatsCreateItemAPIView(generics.CreateAPIView):
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.all()