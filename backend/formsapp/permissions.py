from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTeacherOrAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, 'role', 'student') in ('teacher', 'admin')


class IsOwnerOrTeacherAdmin(BasePermission):
    """
    Students can access only their own submissions.
    Teachers and admins can access all.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(user, 'role', 'student') in ('teacher', 'admin'):
            return True
        return obj.user_id == user.id