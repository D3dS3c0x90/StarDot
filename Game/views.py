from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import UsersToPlay, Guess, Play
import json

# API CLASS
class API:
    def __init__(self):
        pass
    
    def check_stars(self, guess, number):
        
        # My generator expression for looping on every position
        # zip(list1, list2) => compair 2 lists with each element position
        # for i, j in zip() => every element in lists stored in i and j for every list
        return sum(
            i == j
            for i, j in zip(str(guess), str(number))
        )
        
    def check_dots(self, guess, number):
        
        return sum(
            g in str(number) and g != str(number)[i]
            for i, g in enumerate(str(guess))
        )
    
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
                "result": "دور الآخر",
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
        
        stars = self.check_stars(my_guess, friend_number)
        dots = self.check_dots(my_guess, friend_number)
        
        # win = 1 if stars == 4 else 0
        # friend_win = -1 if stars == 4 else 0
        winning = stars == 4
        if winning:
            
            Play.objects.filter(
                hash=hash,
                user_id=user_id
                ).update(
                win=winning
            )
        
        return JsonResponse({
            "status": "success",
            "result": "دور الآخر",
            "stars": stars,
            "dots": dots,
            "win" : int(winning),
        }, status=200)

# Create your views here.
def play(request, my_id, friend_id, hash):
    who_am_i = UsersToPlay.objects.get(user_id=my_id)
    who_is_my_friend = UsersToPlay.objects.get(user_id=friend_id)
    
    my_friend_win, my_win = 0, 0
    
    # To hide first modal about asking the first number 
    hide = Play.objects.filter(hash=hash, user_id=who_am_i.id).exists()
    hide = 1 if hide else 0
    
    if hide:
        my_play = Play.objects.filter(
            user=who_am_i,
            hash=hash
        ).first()

        my_friend_play = Play.objects.filter(
            user=who_is_my_friend,
            hash=hash
        ).first()
        
        my_friend_win = my_friend_play.win if my_friend_play else False
        my_win = my_play.win
        
        my_first_number = my_play.my_number

        my_guess = list(
            Guess.objects.filter(play=my_play).values_list('guess_number', flat=True)
        )
        
        friend_guess = list(
            Guess.objects.filter(play=my_friend_play).values_list('guess_number', flat=True)  
        )
        
        stars = list(
            api.check_stars(x, my_friend_play.my_number) for x in my_guess
        )
        
        dots = list(
            api.check_dots(x, my_friend_play.my_number) for x in my_guess
        )
        
        friend_stars = [ 
            api.check_stars( guess, my_play.my_number ) for guess in friend_guess 
            ] 
        
        friend_dots = [ 
            api.check_dots( guess, my_play.my_number ) for guess in friend_guess 
            ]
        
    else:
        my_guess, friend_guess = [], []
        my_first_number = ''
        stars, dots, friend_stars, friend_dots = 0, 0, 0, 0
            
    data = {
        "me" : who_am_i,
        "friend" : who_is_my_friend,
        "hash" : hash,
        "hide" : hide,
        "my_number" : my_first_number,
        "friend_sug": json.dumps(my_guess),
        "my_sug": json.dumps(friend_guess),
        "stars": json.dumps(friend_stars), 
        "dots": json.dumps(friend_dots), 
        "friend_stars": json.dumps(stars), 
        "friend_dots": json.dumps(dots),
        "friend_win":int(my_friend_win),
        "my_win":int(my_win),
    }
    
    return render(request, "index.html", data)

api = API()