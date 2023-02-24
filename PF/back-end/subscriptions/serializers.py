from rest_framework import serializers
from subscriptions.models import Subscription, UserPayment, UserPaymentCard
from accounts.models import UserProfile


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['plan_name', 'plan_period', 'price', 'description']


# As a user, I can see my payment history (amount, card info, date and time, etc.), as well as my future payments.
class PaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserPayment
        fields = ['plan', 'user', 'amount', 'payment_name', 'payment_card_number', 'payment_security_code', 'payment_exp_date',
                  'payment_date', 'future_payment_date']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserProfile
        fields = ['subscription_name', 'amount', 'future_payment_date']

class UserPaymentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPaymentCard
        fields = ['payment_name', 'payment_card_number', 'payment_security_code', 'payment_exp_date']
