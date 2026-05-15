from django.urls import path
from . import views

urlpatterns = [
    path('play', views.api.create_play, name="create_play"),
    path('guess', views.api.create_guess, name="create_guess"),
]