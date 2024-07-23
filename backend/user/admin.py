from django.contrib import admin
from .models import UserProfile

class UserProfileModelAdmin(admin.ModelAdmin):
    list_display = ('age', 'nickname', 'user_id',)
    search_fields = ('age', 'nickname',)
    list_per_page = 5

admin.site.register(UserProfile, UserProfileModelAdmin)
