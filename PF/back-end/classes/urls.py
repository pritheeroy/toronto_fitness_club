from django.urls import path

from classes.views import StudioClassList, EnrolClassSession, EnrolClassSet, \
    DropClassSession, DropClassSet, UserSchedule, FilterSessions, ClassSetList, GetClassesInfo

urlpatterns = [
    path('<int:pk>/class-list/', StudioClassList.as_view(), name="class_list"),
    path('<int:pk>/enrol-class-session/',
         EnrolClassSession.as_view(), name="enrol_class_session"),
    path('<int:pk>/enrol-class-set/',
         EnrolClassSet.as_view(), name="enrol_class_set"),
    path('<int:pk>/drop-class-session/',
         DropClassSession.as_view(), name="drop_class_session"),
    path('<int:pk>/drop-class-set/', DropClassSet.as_view(), name="drop_class_set"),
    path('user-schedule/', UserSchedule.as_view(), name="user-schedule"),
    path('<int:pk>/filter-sessions/',
         FilterSessions.as_view(), name="filter-sessions"),
    path('class-set-list/', ClassSetList.as_view(), name="class_set_list"),
    path('class-info/', GetClassesInfo.as_view(), name="class_info"),
]
