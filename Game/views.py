from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import UsersToPlay, Guess, Play
import json

# API CLASS
class API:
    def __init__(self):
        pass
    
    def create_play(self, request):
        
        data = json.loads(request.body)

        user_id = data["user_id"]
        my_number = data["my_number"]
        
        Play.objects.create(
            user = UsersToPlay.objects.get(user_id=user_id),
            my_number = my_number
        )
        
        return JsonResponse({
            "status": "success",
        })
        
    def create_guess(self, request):
        pass
        

# Create your views here.
def play(request, my_id, friend_id):
    who_am_i = UsersToPlay.objects.get(user_id=my_id)
    who_is_my_friend = UsersToPlay.objects.get(user_id=friend_id)
    
    data = {
        "me" : who_am_i,
        "friend" : who_is_my_friend
    }
    
    return render(request, "index.html", data)

api = API()