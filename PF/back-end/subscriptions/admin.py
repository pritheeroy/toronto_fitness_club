from django.contrib import admin
from subscriptions.models import Subscription, UserPayment, UserPaymentCard


admin.site.register(Subscription)
admin.site.register(UserPayment)
admin.site.register(UserPaymentCard)