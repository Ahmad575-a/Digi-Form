from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTeacherOrAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return user.role in ('teacher', 'admin')
