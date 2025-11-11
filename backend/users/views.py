from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, ProfileSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserMeView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    def get_object(self):
        return self.request.user
