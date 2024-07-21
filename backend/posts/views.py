from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Post
from .serializers import PostsSerializer


class PostsListAPIView(generics.ListAPIView):
    serializer_class = PostsSerializer

    def get_queryset(self):
        return Post.objects.all()


class PostItemAPIView(generics.GenericAPIView):
    serializer_class = PostsSerializer

    def get(self, request, id):
        try:
            query_set = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return Response('Not found', status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(query_set)
        return Response(serializer.data)
