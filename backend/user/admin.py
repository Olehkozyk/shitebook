from django.contrib import admin
from .models import UserProfile

class UserProfileModelAdmin(admin.ModelAdmin):
    readonly_fields = ('age', 'avatar_id', 'avatar_url')
    list_display = ('age', 'nickname', 'user_id',)
    search_fields = ('nickname', 'birth_date', 'age')
    list_per_page = 5

admin.site.register(UserProfile, UserProfileModelAdmin)
