from rest_framework import viewsets, permissions, filters
from .models import Form
from .serializers import FormSerializer
from .permissions import IsTeacherOrAdminOrReadOnly

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
