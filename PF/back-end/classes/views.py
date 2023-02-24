from django.shortcuts import get_object_or_404

# Create your views here.
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from classes.serializer import ClassSessionSerializer, UserEnrolSerializer, ClassSetSerializer
from classes.models import ClassSession, ClassSet, Studio, EnrolledUser
from rest_framework.views import APIView


class StudioClassList(ListAPIView):
    serializer_class = ClassSessionSerializer
    pagination_class = PageNumberPagination

    def get_object(self):
        # Checks if the studio exists
        return get_object_or_404(Studio, pk=self.kwargs['pk'])

    def get_queryset(self):
        # Gets the studio to search in and all its classes
        try:
            print("test")
            studio = self.get_object()
            class_sets = ClassSet.objects.filter(studio=studio)

            # Creates an empty queryset
            classes = ClassSession.objects.none()
            for class_set in class_sets:
                # Added all the class sessions into a query set if date is greater than now
                classes = classes | ClassSession.objects.filter(
                    name=class_set, start_date_time__gte=timezone.now())
            # Orders them by start date
            serializer = ClassSessionSerializer(
                classes.order_by('start_date_time'), many=True)
        except Exception as e:
            print("hello")
        print("after")
        return serializer.data


class EnrolClassSession(APIView):
    permission_classes = [IsAuthenticated]  # authenticated users can edit

    def get_object(self, pk):
        # Checks if the studio exists
        return get_object_or_404(ClassSession, pk=self.kwargs['pk'])

    def post(self, request, pk):
        # Gets class sets and sessions
        class_session = self.get_object(pk)

        try:
            # Checks if the user is an active user
            subscribed = self.request.user.subscribed
            if not subscribed:
                return Response("This user does not have an active subscription",
                                status=status.HTTP_400_BAD_REQUEST)
            # Checks if the user is previously enrolled
            already_enrolled = EnrolledUser.objects.filter(
                user=self.request.user,
                class_session=class_session
            )
            if already_enrolled:
                return Response("User has already enrolled into this class session", status=status.HTTP_400_BAD_REQUEST)
            # Checks whether class had already passed
            start_date = class_session.start_date_time
            if start_date < timezone.now():
                return Response("Class has already passed", status=status.HTTP_400_BAD_REQUEST)
            # Checks whether there is space in the class
            class_session_name = self.get_object(pk).name
            class_set = ClassSet.objects.get(name=class_session_name)
            enrolled = class_session.enrolled
            if enrolled + 1 > class_set.capacity:
                return Response("Class has reached its max capacity.", status=status.HTTP_400_BAD_REQUEST)
            class_session.enrolled = enrolled + 1
            class_session.save()
            EnrolledUser.objects.create(user=self.request.user,
                                        class_session=class_session)
            return Response("You have successfully enrolled in this class session", status=status.HTTP_200_OK)
        except:
            return Response("Error in your request please try again", status=status.HTTP_400_BAD_REQUEST)


class EnrolClassSet(APIView):
    permission_classes = [IsAuthenticated]  # authenticated users can edit

    def get_object(self, pk):
        # Checks if the studio exists
        return get_object_or_404(ClassSession, pk=self.kwargs['pk'])

    def get(self, request, pk):
        class_session_name = self.get_object(pk).name
        class_set = ClassSet.objects.get(name=class_session_name)
        print(class_set)
        # Checks if the user is an active user
        subscribed = self.request.user.subscribed
        if not subscribed:
            return Response("This user does not have an active subscription.", status=status.HTTP_400_BAD_REQUEST)
        not_started = ClassSession.objects.filter(
            name=class_set, start_date_time__gte=timezone.now())
        if not_started:
            # Loops through each class session in class set
            for class_session in not_started:
                enrolled = class_session.enrolled
                # Checks whether there is space in the class
                if enrolled + 1 > class_set.capacity:
                    return Response(
                        f"Could not complete request because class on {class_session.start_date_time.date()} "
                        f"has reached its max capacity", status=status.HTTP_400_BAD_REQUEST)
            count_enrolled = 0
            for class_session in not_started:

                # Create the object to add it to the model
                enrolled_user = EnrolledUser.objects.filter(
                    user=self.request.user,
                    class_session=class_session
                )
                if not enrolled_user:
                    count_enrolled += 1
                    enroll_user = EnrolledUser.objects.create(
                        user=self.request.user, class_session=class_session)
                    enrolled = class_session.enrolled
                    class_session.enrolled = enrolled + 1
                    class_session.save()
                    enroll_user.save()
            if count_enrolled == 0:
                return Response("User has already enrolled in this class set", status=status.HTTP_400_BAD_REQUEST)
            return Response("You have successfully enrolled in this class set", status=status.HTTP_200_OK)
        return Response("All the courses have passed", status=status.HTTP_400_BAD_REQUEST)


class DropClassSession(APIView):
    permission_classes = [IsAuthenticated]  # authenticated users can edit

    def get_object(self):
        # Checks if the studio exists
        return get_object_or_404(ClassSession, pk=self.kwargs['pk'])

    def delete(self, request, pk):
        class_session = self.get_object()

        try:
            # Checks if the user is enrolled
            enrolled_user = EnrolledUser.objects.filter(
                user=self.request.user,
                class_session=class_session
            )
            if not enrolled_user:
                return Response("User is not enrolled into this class", status=status.HTTP_400_BAD_REQUEST)
            enrolled = class_session.enrolled

            # # Checks if the user is an active user
            # subscribed = self.request.user.subscribed
            # if not subscribed:
            #     return Response("This user does not have an active subscription",
            #                     status=status.HTTP_400_BAD_REQUEST)
            # Removes the user from the number of enrolled
            class_session.enrolled = enrolled - 1
            class_session.save()
            enrolled_user.delete()
            return Response("You have successfully dropped in this class session", status=status.HTTP_200_OK)
        except:
            return Response("Error in your request please try again", status=status.HTTP_400_BAD_REQUEST)


class DropClassSet(APIView):
    def get_object(self, pk):
        # Checks if the studio exists
        print("not yettt")
        return get_object_or_404(ClassSession, pk=self.kwargs['pk'])

    def delete(self, request, pk):
        class_session_name = self.get_object(pk).name
        class_set = ClassSet.objects.get(name=class_session_name)
        # Checks if the user is an active user
        # subscribed = self.request.user.subscribed

        # if not subscribed:
        #     return Response("This user does not have an active subscription", status=status.HTTP_400_BAD_REQUEST)
        print(class_set)
        not_started = ClassSession.objects.filter(
            name=class_set, start_date_time__gte=timezone.now())
        if not not_started:
            return Response("Class sessions have already passed", status=status.HTTP_400_BAD_REQUEST)

        # Loops through each class session in class set
        count_enrolled = 0
        for class_session in not_started:
            enrolled_user = EnrolledUser.objects.filter(
                user=self.request.user,
                class_session=class_session
            )
            if enrolled_user:
                # Remove user from enrolled number
                enrolled = class_session.enrolled
                class_session.enrolled = enrolled - 1
                class_session.save()
                # Delete the object
                enrolled_user.delete()
                count_enrolled += 1
            print(enrolled_user)
        if count_enrolled == 0:
            return Response("User is not enrolled in any session of this class set", status=status.HTTP_400_BAD_REQUEST)
        return Response("You have successfully dropped in this class set")


class UserSchedule(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassSessionSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Creates an empty queryset
        classes = ClassSession.objects.none()

        user_classes = EnrolledUser.objects.filter(user=self.request.user)
        for user_class in user_classes:
            # Added all the class sessions into a query set
            classes = classes | ClassSession.objects.filter(
                id=user_class.class_session.id)

        # Orders them by start date
        serializer = ClassSessionSerializer(
            classes.order_by('start_date_time'), many=True)

        return serializer.data


class FilterSessions(ListAPIView):
    serializer_class = ClassSessionSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        studio = Studio.objects.get(id=self.kwargs['pk'])
        print(self.kwargs['pk'])
        class_name = self.request.data.get('class_name')
        filtered_sets = ClassSet.objects.filter(studio=studio)
        if class_name:
            filtered_sets = filtered_sets.filter(name=class_name)

        result = ClassSession.objects.none()
        for sessions in filtered_sets:
            filters = {
                'name': sessions,
                'coach': self.request.data.get('coach'),
                'start_date_time': self.request.data.get('start_date_time'),
                'end_time': self.request.data.get('end_time'),
            }
            filters = {k: v for k, v in filters.items() if v is not None}
            result = result | ClassSession.objects.filter(**filters)

        return result


class ClassSetList(APIView):

    def get(self, request):
        class_set = ClassSet.objects.all()
        serializer = ClassSetSerializer(class_set, many=True)
        return Response(serializer.data)


class GetClassesInfo(APIView):

    def get(self, request):
        coaches = ClassSet.objects.values_list('coach', flat=True)
        name = ClassSet.objects.values_list('name', flat=True)
        data = {
            'coaches': coaches,
            'name': name
        }

        return Response(data)
