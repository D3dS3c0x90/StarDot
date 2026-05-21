from django.db import models

# Create your models here.
class UsersToPlay(models.Model):
    user_id         = models.BigIntegerField(blank=False)
    user_name       = models.CharField(max_length=25)
    
class Play(models.Model):
    user            = models.ForeignKey(UsersToPlay, on_delete=models.CASCADE) 
    my_number       = models.BigIntegerField(blank=False)
    hash            = models.CharField(blank=True, max_length=10)
    win             = models.BooleanField(default=False)
    
class Guess(models.Model):
    play            = models.ForeignKey(Play, on_delete=models.CASCADE)
    guess_number    = models.CharField(blank=False, max_length=4)
    