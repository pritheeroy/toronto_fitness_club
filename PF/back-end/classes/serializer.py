from rest_framework import serializers

from classes.models import EnrolledUser, ClassSet


class ClassSessionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=200, default="test")
    description = serializers.CharField(max_length=200, default="test")
    coach = serializers.CharField(max_length=200, default="test")
    start_date_time = serializers.DateTimeField()
    end_time = serializers.TimeField()
    enrolled = serializers.IntegerField(default=0)


class UserEnrolSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrolledUser
        fields = ['class_session']


class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrolledUser
        fields = ['user', 'class_session']


class ClassSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSet
        fields = ['studio', 'name', 'description', 'coach',
                  'start', 'end_time', 'reoccur_until', 'capacity']
