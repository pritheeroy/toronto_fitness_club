from django.urls import path
from subscriptions.views import SubscriptionsView, SubscribeView, SubscriptionView, UpdatePaymentView, PaymentHistoryView, UpdateSubscriptionView, CancelSubscriptionView, UserSubscriptionView, UserPaymentCardInformationView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'subscriptions'

urlpatterns = [
    path('all/', SubscriptionsView.as_view(), name='all'),
    path('<str:plan_name>/', SubscriptionView.as_view(), name='all'),
    path('<str:plan_name>/subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('payment/view/', UserPaymentCardInformationView.as_view(), name='payment_info'), 
    path('payment/update/', UpdatePaymentView.as_view(), name='payment'),
    path('payment/history/', PaymentHistoryView.as_view(), name='payment_history'),
    path('user/update/', UpdateSubscriptionView.as_view(), name='update'),
    path('user/details/', UserSubscriptionView.as_view(), name='subscription'),
    path('user/cancel/', CancelSubscriptionView.as_view(), name='cancel'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]