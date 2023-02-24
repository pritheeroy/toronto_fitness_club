from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import UserProfile


# Create your models here.
class Subscription(models.Model):
    #admin
    plan_name = models.CharField(max_length=500, primary_key=True)
    MONTHLY = 'monthly'
    YEARLY = 'yearly'
    PLAN_PERIOD = [
        (MONTHLY, _('Monthly')),
        (YEARLY, _('Yearly')),
    ]
    plan_period = models.CharField(max_length=32, choices=PLAN_PERIOD, default=MONTHLY)
    price = models.CharField(max_length=100)
    description = models.CharField(max_length=10000)

    def __str__(self):
        return self.plan_name


class UserPayment(models.Model):
    plan = models.ForeignKey(to=Subscription, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(to=UserProfile, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.CharField(max_length=100)
    payment_card_number = models.CharField(max_length=25)
    payment_security_code = models.CharField(max_length=5)
    payment_exp_date = models.CharField(max_length=25)
    payment_name = models.CharField(max_length=1000)
    payment_date = models.DateTimeField()
    future_payment_date = models.DateTimeField(blank=True, null=True)

class UserPaymentCard(models.Model):
    payment_card_number = models.CharField(max_length=25)
    payment_security_code = models.CharField(max_length=5)
    payment_exp_date = models.CharField(max_length=25)
    payment_name = models.CharField(max_length=1000)
    user = models.OneToOneField(to=UserProfile, on_delete=models.CASCADE)




