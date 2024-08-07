from django.urls import path
from .views import (
    UserProfileListView,
    UserDetailView,
    UserProfileUpdateView,
    UserLoginView,
    UserRegisterView,
    CurrentUserDetailView,
    UserListView,
)

urlpatterns = [
    path('/profiles', UserProfileListView.as_view(), name='user-profile-list'),
    path('/profile/<int:pk>/', UserDetailView.as_view(), name='user-profile-retrieve'),
    path('/profiles/update/<int:pk>/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('/profile/', CurrentUserDetailView.as_view(), name='user'),
    path('/register', UserRegisterView.as_view(), name='register'),
    path('/login/', UserLoginView.as_view(), name='login'),
    # path('/logout', UserLogout.as_view(), name='logout'),
    path('/list/', UserListView.as_view(), name='user'),
]
