from .models import Post
from .serializers import PostsSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView, # new
    DestroyAPIView, # new
)

# Create view
class PostCreateView(CreateAPIView):
    serializer_class = PostsSerializer

# List view
class PostListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(author=user)
        serializer = PostsSerializer(posts, many=True)
        return Response(serializer.data)

# Retrieve view
class PostRetrieveView(RetrieveAPIView):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()

# Update view
class PostUpdateView(UpdateAPIView):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()

# Delete view
class PostDeleteView(DestroyAPIView):
    serializer_class = PostsSerializer
    queryset = Post.objects.all()

