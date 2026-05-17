from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import UsersToPlay, Guess, Play
import json

# API CLASS
class API:
    def __init__(self):
        pass
    
    def create_play(self, request):

        user_id = request.GET["user_id"]
        my_number = request.GET["my_number"]
        hash = request.GET["hash"]
        
        try:
        
            Play.objects.create(
                user = UsersToPlay.objects.get(user_id=user_id),
                my_number = my_number,
                hash = hash
            )
            
            return JsonResponse({
                "status": "success",
                "number": my_number,
                "result": "wait",
            }, status=200)
            
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=500)
        
    def create_guess(self, request):
        url_user_id = request.GET["user_id"]
        my_guess = request.GET["guess"]
        hash = request.GET["hash"]
        
        user = UsersToPlay.objects.get(user_id=url_user_id)
        user_id = user.id
        
        # My friend number to get info (star, dot)
        friend_number = Play.objects.filter(hash=hash).exclude(user=user).first().my_number
        
        # Store my guesses
        Guess.objects.create(
            guess_number = my_guess,
            play = Play.objects.get(hash=hash, user_id=user_id)
        )
        
        return JsonResponse({
            "status": "success",
            "value": [user_id, my_guess, hash],
            "result": "wait",
        }, status=200)

# Create your views here.
def play(request, my_id, friend_id, hash):
    who_am_i = UsersToPlay.objects.get(user_id=my_id)
    who_is_my_friend = UsersToPlay.objects.get(user_id=friend_id)
    
    hide = Play.objects.filter(hash=hash, user_id=who_am_i.id).exists()
    hide = 1 if hide else 0
    
    my_play = Play.objects.get(user_id=who_am_i.id, hash=hash)
    my_first_number = my_play.my_number

    # my_suggestions = Guess.objects.filter(play_id=my_play)
    # friend_suggestions = Guess.objects.filter(play_id=Play.objects.get(user_id=who_is_my_friend.id, hash=hash))
        
    data = {
        "me" : who_am_i,
        "friend" : who_is_my_friend,
        "hash" : hash,
        "hide" : hide,
        "my_number" : my_first_number,
        # "my_sug" : my_suggestions,
        # "friend_sug" : friend_suggestions,
    }
    
    return render(request, "index.html", data)

api = API()