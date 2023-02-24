from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import UsersList, UserSignUp, UserEdit, UserDetail

urlpatterns = [
    path('signup/', UserSignUp.as_view(), name="signup"),
    path('list/', UsersList.as_view(), name="user_list"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('edit/', UserEdit.as_view(), name="user_edit"),
    path('details/', UserDetail.as_view(), name="user_detail")
]
