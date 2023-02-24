from rest_framework import serializers
from studios.models import Studio, Amenity


class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = '__all__'


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'


class SearchAllSerializer(serializers.Serializer):
    studio_name = serializers.CharField(required=False)
    amenities = serializers.CharField(required=False)
    class_name = serializers.CharField(required=False)
    coach = serializers.CharField(required=False)