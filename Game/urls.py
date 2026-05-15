from django.urls import path
from . import views


urlpatterns = [
    path('<int:my_id>/<int:friend_id>', views.play, name="play"),
]