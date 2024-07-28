from django.urls import path
from .views import PostListView, PostCreateView, PostRetrieveView, PostUpdateView, PostDeleteView
urlpatterns = [
    # Get List #GET
    path('/', PostListView.as_view(), name='post-list'),

    # Create view #POST
    path('/create/', PostCreateView.as_view(), name='post-create'),

    # Retrieve view (Read one) #GET
    path('/<int:pk>/', PostRetrieveView.as_view(), name='post-retrieve'),

    # Update view #PUT
    path('/update/<int:pk>/', PostUpdateView.as_view(), name='post-update'),

    # Delete view #DELETE
    path('/delete/<int:pk>/', PostDeleteView.as_view(), name='post-destroy'),
]