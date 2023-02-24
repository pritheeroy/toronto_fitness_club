from django.contrib import admin

# Register your models here.
from classes.models import ClassSet, ClassSession, Keyword, EnrolledUser

admin.site.register(ClassSet)
admin.site.register(ClassSession)
admin.site.register(Keyword)
admin.site.register(EnrolledUser)
