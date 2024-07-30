from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', LogoutUser.as_view(), name='logout'),

    path('user/', UserView.as_view(), name='user'),
    path('user/<uuid:pk>/', UserView.as_view(), name='user'),
    path('category/', CategoryView.as_view(), name='category'),
    path('category/<uuid:pk>/', CategoryView.as_view(), name='category'),
    path('location/', LocationView.as_view(), name='location'),
    path('location/<uuid:pk>/', LocationView.as_view(), name='location'),
    path('event/', EventView.as_view(), name='event'),
    path('event/<uuid:pk>/', EventView.as_view(), name='event'),
]
