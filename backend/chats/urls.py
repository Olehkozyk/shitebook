from django.urls import path
from .views import ChatsItemAPIView, ChatsCreateItemAPIView
urlpatterns = [
    path('/<str:id_user>', ChatsItemAPIView.as_view(), name='chats'),
    path('/create', ChatsCreateItemAPIView.as_view(), name='chat-create'),
]