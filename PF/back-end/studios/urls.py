from django.urls import path

from studios.views import StudiosList, StudiosDistanceList, FilterStudios, StudioDetail, AmenitiesList

urlpatterns = [
    path('list/', StudiosList.as_view(), name="studios"),
    path('distancelist/', StudiosDistanceList.as_view(), name="studios_distance_list"),
    path('<int:pk>/', StudioDetail.as_view(), name="studio_detail"),
    path('filter-studios/', FilterStudios.as_view(), name="filter_studios"),
    path('amenities/', AmenitiesList.as_view(), name="amenities")
]
