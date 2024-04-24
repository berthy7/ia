from django.db import models

# Create your models here.
class Intent(models.Model):
    tag = models.CharField(max_length=100)
    class Meta:
        db_table = "system_intent"

class Pattern(models.Model):
    message = models.CharField(max_length=250)
    fkintent = models.ForeignKey(Intent, on_delete=models.CASCADE)
    class Meta:
        db_table = "system_pattern"

class Response(models.Model):
    message = models.CharField(max_length=250)
    fkintent = models.ForeignKey(Intent, on_delete=models.CASCADE)
    class Meta:
        db_table = "system_response"


class Setting(models.Model):
    messageInitial = models.CharField(max_length=100)
    epoch = models.IntegerField()
    batchsize = models.IntegerField()

    class Meta:
        db_table = "system_setting"