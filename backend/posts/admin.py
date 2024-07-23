from django.contrib import admin
from .models import Post

class PostsModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at', 'created_at',)
    search_fields = ('title', 'description',)
    list_per_page = 5

admin.site.register(Post, PostsModelAdmin)
