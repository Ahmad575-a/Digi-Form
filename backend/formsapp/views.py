from rest_framework import viewsets, permissions, filters
from .models import Form, Submission
from .serializers import FormSerializer, SubmissionSerializer
from .permissions import IsTeacherOrAdminOrReadOnly, IsOwnerOrTeacherAdmin


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
