from django.db import models
from django.contrib.auth.models import User, AbstractUser, BaseUserManager
from django.db.models import SET_NULL


# Create your models here.
class UserManager(BaseUserManager):
    def _create_user(self, email, password):
        if not email:
            raise ValueError("Email required!")
        if not password:
            raise ValueError("Password required!")

        user = self.model(
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        if not email:
            raise ValueError("Email required!")
        if not password:
            raise ValueError("Password required!")

        user = self.model(
            email=self.normalize_email(email),
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True

        user.set_password(password)
        user.save(using=self._db)
        return user


class UserProfile(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_num = models.CharField(max_length=20)
    avatar = models.ImageField(blank=True, null=True)
    subscribed = models.BooleanField(default=False)
    subscription = models.ForeignKey(to="subscriptions.Subscription",
                                     on_delete=SET_NULL, null=True, blank=True)
    subscription_name = models.CharField(max_length=100, blank=True, null=True)
    amount = models.CharField(max_length=100, blank=True, null=True)
    future_payment_date = models.DateTimeField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
