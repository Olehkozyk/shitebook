from django.urls import path
from .views import PostsListAPIView, PostItemAPIView
urlpatterns = [
    path('', PostsListAPIView.as_view(), name='posts'),
    path('/<str:id>', PostItemAPIView.as_view(), name='post'),
]