from rest_framework import status

from .filters import PostsFilter
from .models import Post, Comment
from .pagination import PaginationPosts, CommentPagination
from .serializers import PostsSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,  # new
    DestroyAPIView,  # new
    GenericAPIView,
)


# Create view
class PostCreateView(CreateAPIView):
    serializer_class = PostsSerializer


# List view
class PostListUserView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostsSerializer
    pagination_class = PaginationPosts

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user).select_related('author__profile')


class PostListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PostsSerializer
    pagination_class = PaginationPosts
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PostsFilter

    def get_queryset(self):
        return Post.objects.all().select_related('author__profile')


class PostCommentView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id).order_by('-created_at')


class PostLikeView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        if user in post.likes.all():
            post.likes.remove(user)
            is_like = False
        else:
            post.likes.add(user)
            is_like = True

        likes_count = post.likes.count()

        return Response({
            'status': True,
            'is_like': is_like,
            'likes_count': likes_count,
        }, status=status.HTTP_200_OK)


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
