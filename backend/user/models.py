from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField
from cloudinary.utils import cloudinary_url
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import Group, Permission


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    nickname = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = CloudinaryField('Avatar',
                             overwrite=True,
                             resource_type="image",
                             transformation={"quality": "auto:eco"},
                             null=True,
                             blank=True
                             )
    online_status = models.BooleanField(default=False)
    avatar_id = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.avatar:
            self.avatar_id = self.avatar.public_id
            self.avatar_url = cloudinary_url(self.avatar.public_id)[0]
            super().save(update_fields=['avatar_id', 'avatar_url'])

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
