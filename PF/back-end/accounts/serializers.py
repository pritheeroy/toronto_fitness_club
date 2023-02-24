import re

from rest_framework import serializers
from accounts.models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "min_length": f"Password must be at least 8 characters."
        }
    )

    class Meta:
        model = UserProfile
        fields = ['pk', 'first_name', 'last_name', 'password', 'password2', 'email', 'phone_num', 'avatar']

    def validate(self, data):
        # valid phone number
        phone_num = data['phone_num']
        pattern = '^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$'
        match = re.match(pattern, phone_num)
        if not match:
            raise serializers.ValidationError("Enter a valid phone number.")

        # password match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match!")
        return data

    def create(self, validated_data):
        user = UserProfile.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_num=validated_data["phone_num"],
            avatar=validated_data["avatar"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
