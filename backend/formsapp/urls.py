from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FormViewSet,
    SubmissionViewSet,
    FormSubmissionListView,
    FormStatisticsView,
)

router = DefaultRouter()
router.register('forms', FormViewSet, basename='forms')
router.register('submissions', SubmissionViewSet, basename='submissions')

urlpatterns = [
    path('', include(router.urls)),
    path(
        'forms/<int:form_id>/submissions/',
        FormSubmissionListView.as_view({'get': 'list'}),
        name='form-submission-list',
    ),
    path(
        'forms/<int:form_id>/stats/',
        FormStatisticsView.as_view({'get': 'retrieve'}),
        name='form-stats',
    ),
]
