from rest_framework import status
from rest_framework.generics import get_object_or_404, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from studios.models import Studio, Amenity, Image

from studios.serializers import StudioSerializer, AmenitySerializer
from geopy import distance


# Create your views here.
class StudiosList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = StudioSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return Studio.objects.all()


class AmenitiesList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AmenitySerializer
    # pagination_class = PageNumberPagination

    def get_queryset(self):
        return Amenity.objects.all()


class StudiosDistanceList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = StudioSerializer
    pagination_class = PageNumberPagination

    # def get_queryset(self):
    #     # validate request keys
    #     keys = ['lat', 'long']
    #     self.request.data.get('lat')
    #     for key in keys:
    #         if key not in list(self.request.data.keys()):
    #             return Response("Missing '{0}' in request.".format(key), status=status.HTTP_400_BAD_REQUEST)
    #
    #     # validate geolocation values
    #     if float(self.request.data.get('lat')) < -90 or float(self.request.data.get('lat')) > 90 or \
    #             float(self.request.data.get('long')) < -180 or float(self.request.data.get('long')) > 180:
    #         return Response("Enter a valid geolocation.", status=status.HTTP_400_BAD_REQUEST)
    #
    #     user_location = (self.request.data.get('lat'), self.request.data.get('long'))  # user input (coordinates)
    #
    #     studios = Studio.objects.all()
    #     serializer = StudioSerializer(studios, many=True)
    #     studios_temp = []
    #
    #     for studio in serializer.data:  # print studio name of all studios
    #         studio_location = (studio['location_lat'], studio['location_long'])
    #         studio['distance'] = str(round(distance.distance(user_location, studio_location).miles, 6))  # set distance
    #         studios_temp.append(dict(studio))  # add studio to temp studio list
    #
    #     studios_by_distance = sorted(studios_temp, key=lambda x: x['distance'])  # sort temp studio list by distance
    #     return studios_by_distance

    def post(self, request, *args, **kwargs):
        # validate request keys
        keys = ['lat', 'long']
        self.request.data.get('lat')
        for key in keys:
            if key not in list(self.request.data.keys()):
                return Response("Missing '{0}' in request.".format(key), status=status.HTTP_400_BAD_REQUEST)

        # validate geolocation values
        if float(self.request.data.get('lat')) < -90 or float(self.request.data.get('lat')) > 90 or \
                float(self.request.data.get('long')) < -180 or float(self.request.data.get('long')) > 180:
            return Response("Enter a valid geolocation.", status=status.HTTP_400_BAD_REQUEST)

        user_location = (self.request.data.get('lat'), self.request.data.get('long'))  # user input (coordinates)

        studios = Studio.objects.all()
        serializer = StudioSerializer(studios, many=True)
        studios_temp = []

        for studio in serializer.data:  # print studio name of all studios
            studio_location = (studio['location_lat'], studio['location_long'])
            studio['distance'] = str(round(distance.distance(user_location, studio_location).miles, 6))  # set distance
            studios_temp.append(dict(studio))  # add studio to temp studio list

        studios_by_distance = sorted(studios_temp, key=lambda x: x['distance'])  # sort temp studio list by distance
        return Response(studios_by_distance)


class StudioDetail(APIView):
    permission_classes = [AllowAny]

    def get_studio(self, pk):
        return get_object_or_404(Studio, pk=self.kwargs['pk'])

    def get(self, request, pk):
        studio = self.get_studio(pk)

        studio_amenities = Amenity.objects.filter(studio=studio).all()  # get amenities associated with studio
        amenities = []
        for amenity in studio_amenities:
            amenities.append({'type': amenity.type, 'quantity': amenity.quantity})

        studio_images = Image.objects.filter(studio=studio).all()  # get studio images
        images = []
        for image in studio_images:
            images.append({'image': image.image.url})

        # link to get directions
        directions = "https://www.google.com/maps/dir//{0},{1}/".format(studio.location_lat, studio.location_long)

        data = {
            'name': studio.name,
            'address': studio.address,
            'location_lat': studio.location_lat,
            'location_long': studio.location_long,
            'postal_code': studio.postal_code,
            'phone_num': studio.phone_num,
            'amenities': amenities,
            'images': images,
            'directions': directions
        }

        return Response(data)
#

# TEST LOCATION POINT
# {"lat": "43.668374543242265", "long": "-79.39436041259142"}


class FilterStudios(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudioSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        filtered_studio = Studio.objects.all()
        studio = self.request.data.get('studio_name')
        if studio:
            filtered_studio = filtered_studio.filter(name=studio)
        amenities = self.request.data.get('amenities')
        if amenities:
            filtered_studio = filtered_studio.filter(amenity__type=amenities)
        class_name = self.request.data.get('class_name')
        if class_name:
            filtered_studio = filtered_studio.filter(class_studio__name=class_name)
        coach = self.request.data.get('coach')
        if coach:
            filtered_studio = filtered_studio.filter(class_studio__coach=coach)
        return filtered_studio
