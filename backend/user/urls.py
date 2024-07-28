from django.urls import path
from .views import (
    UserProfileListView,
    UserProfileRetrieveView,
    UserProfileUpdateView,
    UserLogin,
    UserRegister,
    UserDetailView,
)

urlpatterns = [
    # Get List #GET
    path('/', UserProfileListView.as_view(), name='user-profile-list'),

    # Retrieve view (Read one) #GET
    path('/<int:pk>/', UserProfileRetrieveView.as_view(), name='user-profile-retrieve'),

    # Update view #PUT
    path('/update/<int:pk>/', UserProfileUpdateView.as_view(), name='user-profile-update'),

    path('/register', UserRegister.as_view(), name='register'),
    path('/login/', UserLogin.as_view(), name='login'),
    # path('/logout', UserLogout.as_view(), name='logout'),
    path('/user/', UserDetailView.as_view(), name='user'),

]
