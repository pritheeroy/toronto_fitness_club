import datetime

from django.contrib.auth.models import AbstractUser, User
from django.core.exceptions import ValidationError
from django.db import models

from django.db.models import CASCADE
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import make_aware

from accounts.models import UserProfile
from studios.models import Studio
from datetime import date
import pandas
import calendar


# Create your models here.
class ClassSet(models.Model):
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='class_studio')
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    start = models.DateTimeField()
    end_time = models.TimeField()
    reoccur_until = models.DateField()
    capacity = models.PositiveIntegerField()

    def clean(self):
        if self.start is not None and self.end_time is not None:
            # Makes sure that the time is in the correct order
            if self.start.time() > self.end_time:
                raise ValidationError('Start time should be before end time')
        else:
            # Doesn't allow the user to input an invalid time
            raise ValidationError('Date Time Format is incorrect')
        # Makes sure that the days is in the correct order
        if self.start.date() > self.reoccur_until:
            raise ValidationError('Start day should be before end day')

    def __str__(self):
        return str(self.name)

    def delete(self, using=None, keep_parents=False):
        # Get today's date
        today = date.today()
        # Gets the range of dates between the start and end date
        date_range = pandas.date_range(today, self.reoccur_until, freq='D')
        # Gets the id of the class set
        class_set_ids = ClassSet.objects.filter(id=self.id)
        for set_id in class_set_ids:
            for a_date in date_range:
                try:
                    # Deletes all future occurrences of the class
                    start_date_time = datetime.datetime.combine(a_date, self.start.time())
                    ClassSession.objects.get(name=set_id, start_date_time=start_date_time).delete()
                except:
                    pass


@receiver(post_save, sender=ClassSet)
def save_class(sender, instance, **kwargs):
    # Gets the first three letters of the weekday that the 1st day starts with
    day = calendar.day_name[instance.start.date().weekday()][:3]
    # Gets the range of dates between the start and end date
    date_range = pandas.date_range(instance.start.date(), instance.reoccur_until, freq=f'W-{day}')
    exists = ClassSession.objects.filter(name=instance)
    if exists:
        first_class = exists[0].start_date_time.date()
        last_class = exists[0].start_date_time.date()
        for a_class in exists:
            # Shortened duration
            if a_class.start_date_time.date() < instance.start.date():
                a_class.delete()
            if a_class.start_date_time.date() > instance.reoccur_until:
                a_class.delete()
            # Find the earliest class in the set
            if a_class.start_date_time.date() < first_class:
                first_class = a_class.start_date_time.date()
            # Find the last class in the set
            if a_class.start_date_time.date() > last_class:
                last_class = a_class.start_date_time.date()
            # Update all fields
            a_class.name = instance
            a_class.description = instance.description
            a_class.coach = instance.coach
            a_class.save()
        # Extends the start date
        if first_class > instance.start.date():
            new_start_range = pandas.date_range(instance.start.date(),
                                                first_class - datetime.timedelta(days=1), freq=f'W-{day}')
            create_class(instance, new_start_range)
        # Extends the end date
        if last_class < instance.reoccur_until:
            new_end_range = pandas.date_range(last_class + datetime.timedelta(days=1),
                                              instance.reoccur_until, freq=f'W-{day}')
            create_class(instance, new_end_range)
    else:
        print('int')
        # Creates a class session for each date
        create_class(instance, date_range)


def create_class(instance, date_range):
    for date in date_range:
        class_session = ClassSession.objects.create(
            name=instance,
            description=instance.description,
            coach=instance.coach,
            start_date_time=datetime.datetime.combine(date, instance.start.time()),
            end_time=instance.end_time,
            enrolled=0
        )
        class_session.save()


class ClassSession(models.Model):
    name = models.ForeignKey(to=ClassSet, on_delete=CASCADE, related_name='class_name')
    description = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    start_date_time = models.DateTimeField()
    end_time = models.TimeField()
    enrolled = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(f'{self.name} -- {self.start_date_time.date()}')


class Keyword(models.Model):
    classSession = models.ForeignKey(to=ClassSession, on_delete=CASCADE)
    word = models.CharField(max_length=200)

    def __str__(self):
        return self.word


class EnrolledUser(models.Model):
    user = models.ForeignKey(to=UserProfile, on_delete=models.CASCADE)
    class_session = models.ForeignKey(to=ClassSession, on_delete=models.CASCADE)

    def __str__(self):
        return str(f'{self.user.first_name} -- {self.class_session}')
