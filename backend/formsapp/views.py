from rest_framework import viewsets, permissions, filters, mixins
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Min, Max
from drf_spectacular.utils import extend_schema

from .models import Form, Submission
from .serializers import FormSerializer, SubmissionSerializer, FormStatsSerializer
from .permissions import (
    IsTeacherOrAdminOrReadOnly,
    IsOwnerOrTeacherAdmin,
    IsTeacherOrAdmin,
)


class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.prefetch_related('fields').all()
    serializer_class = FormSerializer
    permission_classes = [IsTeacherOrAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_queryset(self):
        qs = super().get_queryset()
        # students see only active forms but teachers and admins see everything
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'role', 'student') == 'student':
            return qs.filter(is_active=True)
        return qs


class SubmissionViewSet(viewsets.ModelViewSet):
    # base queryset
    queryset = Submission.objects.select_related('form', 'user').prefetch_related(
        'answers',
        'answers__field',
    )
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrTeacherAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['submitted_at']

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset

        if getattr(user, 'role', 'student') in ('teacher', 'admin'):
            # teachers and admins can see all submissions
            form_id = self.request.query_params.get('form')
            if form_id:
                qs = qs.filter(form_id=form_id)
            return qs

        # students see only their own
        return qs.filter(user=user)


class FormSubmissionListView(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Read-only listing of submissions for a specific form.

    - Only teachers/admins can access this endpoint.
    - Uses the same SubmissionSerializer as SubmissionViewSet.
    """

    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]

    def get_queryset(self):
        form_id = self.kwargs['form_id']
        # ensure the form exists and 404 if not
        get_object_or_404(Form, pk=form_id)

        return (
            Submission.objects
            .filter(form_id=form_id)
            .select_related('user', 'form')
            .prefetch_related('answers', 'answers__field')
            .order_by('-submitted_at')
        )


class FormStatisticsView(viewsets.ViewSet):
    """
    Aggregate statistics for a specific form.
    - Only teachers/admins can access this endpoint.
    - Returns counts and time range of submissions, plus per-class filtering.
    """

    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]
    serializer_class = FormStatsSerializer

    @extend_schema(responses=FormStatsSerializer)
    def retrieve(self, request, form_id=None):
        form = get_object_or_404(Form, pk=form_id)

        submissions_qs = Submission.objects.filter(form=form).select_related('user')

        total_submissions = submissions_qs.count()
        unique_students = (
            submissions_qs.values_list('user_id', flat=True).distinct().count()
        )

        submissions_by_class = {}
        for submission in submissions_qs:
            user = submission.user
            class_name = getattr(user, 'class_name', None) or "unknown"
            submissions_by_class[class_name] = submissions_by_class.get(class_name, 0) + 1

        aggregates = submissions_qs.aggregate(
            first_submission_at=Min('submitted_at'),
            last_submission_at=Max('submitted_at'),
        )

        data = {
            "form_id": form.id,
            "title": form.title,
            "is_active": form.is_active,
            "total_submissions": total_submissions,
            "unique_students": unique_students,
            "submissions_by_class": submissions_by_class,
            "first_submission_at": aggregates["first_submission_at"],
            "last_submission_at": aggregates["last_submission_at"],
        }

        serializer = FormStatsSerializer(data)
        return Response(serializer.data)
