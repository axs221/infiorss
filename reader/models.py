from django.db import models

# Create your models here.

class Feed(models.Model):
    uri = models.CharField(max_length=300)
    title = models.CharField(max_length=300, default="News")

    def __str__(self):
        return self.title