from accounts.models import UserProfile
from accounts.serializers import UserSerializer
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny


class UsersList(APIView):

    def get(self, request):
        users = UserProfile.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserSignUp(CreateAPIView):
    permission_classes = [AllowAny]  # anyone can sign up
    serializer_class = UserSerializer


class UserEdit(UpdateAPIView):
    permission_classes = [IsAuthenticated]  # authenticated users can edit
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data
        if user == self.request.user:  # user authenticated :)
            # update user fields
            for attribute in data:
                if data.get(attribute, getattr(user, attribute)):  # check for empty attributes
                    setattr(user, attribute, data.get(attribute, getattr(user, attribute)))

            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data)
        return Response({'error': 'Unauthenticated user.'}, status.HTTP_401_UNAUTHORIZED)  # user not authenticated :(


class UserDetail(APIView):
    permission_classes = [IsAuthenticated]  # authenticated users can edit
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer

    def get(self, request):
        user = UserProfile.objects.get(id=self.request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

# TEST USER
# { "first_name": "test", "last_name": "user", "email": "test@test.com", "avatar": "something", "phone_num": "000-000-0000" }