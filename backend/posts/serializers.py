from rest_framework import serializers
from .models import Post, Comment
from user.serializers import UserSerializer


class PostsSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'description',
            'image_url',
            'created_at',
            'updated_at',
            'author',
            'comments_count',
            'is_liked',
            'likes_count',
        ]

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()


    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return user in obj.likes.all()
        return False


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
