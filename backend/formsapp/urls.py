from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FormViewSet, SubmissionViewSet

router = DefaultRouter()
router.register('forms', FormViewSet, basename='forms')
router.register('submissions', SubmissionViewSet, basename='submissions')

urlpatterns = [
    path('', include(router.urls)),
]
