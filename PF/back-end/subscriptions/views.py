from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveUpdateAPIView, \
    DestroyAPIView
from subscriptions.models import Subscription, UserPayment, UserPaymentCard
from accounts.models import UserProfile
from subscriptions.serializers import SubscriptionSerializer, PaymentSerializer, UserSubscriptionSerializer, UserPaymentCardSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta


class SubscriptionsView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SubscriptionSerializer
    paginate_by = 10

    def get_queryset(self):
        return Subscription.objects.all()


class SubscriptionView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_object(self):
        return get_object_or_404(Subscription, plan_name=self.kwargs['plan_name'])


class UserSubscriptionView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer

    def get_object(self):
        return get_object_or_404(UserProfile, id=self.request.user.id)


class SubscribeView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserPayment.objects.all()
    serializer_class = PaymentSerializer

    def get_object(self):
        # return Subscription.objects.filter(plan_name=self.kwargs['plan_name']).first()
        return get_object_or_404(Subscription, plan_name=self.kwargs['plan_name'])

    def post(self, request, *args, **kwargs):
        print(request.user.subscribed)
        if request.user.subscribed == False and UserPayment.objects.filter(user=self.request.user):
            future = timezone.timedelta(weeks=+0)
            if UserPayment.objects.filter(user=self.request.user).latest('payment_date').plan.plan_period == 'monthly':
                future = timezone.timedelta(weeks=+4)

            if UserPayment.objects.filter(user=self.request.user).latest('payment_date').plan.plan_period == 'yearly':
                future = timezone.timedelta(weeks=+52)

            if UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date + future > timezone.now():
                curr_user = self.request.user
                curr_user.subscribed = True
                curr_user.subscription = Subscription.objects.get(
                    plan_name=self.kwargs['plan_name'])
                curr_user.subscription_name = self.kwargs['plan_name']
                curr_user.amount = Subscription.objects.get(
                    plan_name=self.kwargs['plan_name']).price
                curr_user.future_payment_date = UserPayment.objects.filter(
                    user=self.request.user).latest('payment_date').payment_date + future

                print(self.kwargs['plan_name'])
                curr_user.save()

                # request.data['plan'] = Subscription.objects.get(plan_name=self.kwargs['plan_name']).plan_name
                # request.data['user'] = self.request.user.id
                # request.data['amount'] = Subscription.objects.get(plan_name=self.kwargs['plan_name']).price
                # request.data['payment_date'] = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date
                # request.data['payment_card_number'] = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date
                # request.data['payment_security_code'] = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date
                # request.data['payment_'] = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date
                # UserPayment.objects.filter(user=self.request.user).latest('payment_date').future_payment_date = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date + future
                # UserPayment.objects.filter(user=self.request.user).latest('payment_date').future_payment_date = UserPayment.objects.filter(user=self.request.user).latest('payment_date').payment_date + future

                print(request.user.subscribed)
                return Response("You have subscribed", status=200)

        future = timezone.timedelta(weeks=+0)
        if Subscription.objects.get(plan_name=self.kwargs['plan_name']).plan_period == 'monthly':
            future = timezone.timedelta(weeks=+4)
        else:
            future += timezone.timedelta(weeks=+52)

        print(request.data)
        request.data['plan'] = Subscription.objects.get(
            plan_name=self.kwargs['plan_name']).plan_name
        request.data['user'] = self.request.user.id
        request.data['amount'] = Subscription.objects.get(
            plan_name=self.kwargs['plan_name']).price
        request.data['payment_date'] = timezone.now()
        request.data['future_payment_date'] = timezone.now() + future

        curr_user = self.request.user
        curr_user.subscribed = True
        curr_user.subscription = Subscription.objects.get(
            plan_name=self.kwargs['plan_name'])
        curr_user.subscription_name = self.kwargs['plan_name']
        curr_user.amount = Subscription.objects.get(
            plan_name=self.kwargs['plan_name']).price
        curr_user.future_payment_date = timezone.now() + future

        curr_user.save()

        payment_card = UserPaymentCard(user=self.request.user, payment_name=request.data['payment_name'], payment_card_number=request.data[
                                       'payment_card_number'], payment_security_code=request.data['payment_security_code'], payment_exp_date=request.data['payment_exp_date'])
        payment_card.save()

        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserPaymentCardInformationView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPaymentCardSerializer

    def get_object(self):
        return get_object_or_404(UserPaymentCard, user=self.request.user.id)


class UpdatePaymentView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPaymentCardSerializer

    def get_object(self):
        return get_object_or_404(UserPaymentCard, user=self.request.user)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class PaymentHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    paginate_by = 10

    def get_queryset(self):
        return UserPayment.objects.filter(user=self.request.user.id)


class UpdateSubscriptionView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer
    lookup_field = 'id'

    def get_object(self):
        return get_object_or_404(UserProfile, id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        plan_name = request.data['plan']

        curr_user = self.request.user
        curr_user.subscription = Subscription.objects.get(
            plan_name=self.request.data['plan'])
        curr_user.subscription_name = self.request.data['plan']
        curr_user.amount = Subscription.objects.get(
            plan_name=self.request.data['plan']).price
        curr_user.save()

        curr_plan_name = UserPayment.objects.filter(
            user=self.request.user).latest('payment_date').plan

        # request.data._mutable = True

        future = timezone.timedelta(weeks=+0)
        if Subscription.objects.get(plan_name=plan_name).plan_period == 'monthly':
            if Subscription.objects.get(plan_name=curr_plan_name).plan_period == 'monthly':
                request.data['future_payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
                    'payment_date').future_payment_date
            else:
                request.data['future_payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
                    'payment_date').future_payment_date
        else:
            if Subscription.objects.get(plan_name=curr_plan_name).plan_period == 'yearly':
                request.data['future_payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
                    'payment_date').future_payment_date
            else:
                request.data['future_payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
                    'payment_date').future_payment_date

        request.data['plan'] = plan_name
        request.data['user'] = UserPayment.objects.filter(
            user=self.request.user).latest('payment_date').user.id
        request.data['amount'] = Subscription.objects.get(
            plan_name=plan_name).price
        request.data['payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
            'payment_date').payment_date

        # request.data._mutable = False

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class CancelSubscriptionView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer
    lookup_field = 'id'

    def get_object(self):
        return get_object_or_404(UserProfile, id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        curr_user = self.request.user
        curr_user = request.user
        curr_user.subscribed = False
        curr_user.future_payment_date = None
        curr_user.save()

        curr_plan_name = UserPayment.objects.filter(
            user=self.request.user).latest('payment_date').plan
        print(request.data)

        # request.data._mutable = True

        request.data['future_payment_date'] = None

        request.data['plan'] = curr_plan_name
        request.data['user'] = UserPayment.objects.filter(
            user=self.request.user).latest('payment_date').user.id
        # request.data['amount'] = Subscription.objects.get(plan_name=curr_plan_name).price
        request.data['payment_date'] = UserPayment.objects.filter(user=self.request.user).latest(
            'payment_date').payment_date

        # request.data._mutable = False

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
