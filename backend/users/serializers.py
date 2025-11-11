from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'class_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        validate_password(password, user)
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'class_name', 'phone', 'of_legal_age']
        read_only_fields = ['id', 'username', 'role', 'email']
