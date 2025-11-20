from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.STUDENT)
    class_name = models.CharField(max_length=32, blank=True, default='')
    phone = models.CharField(max_length=32, blank=True, default='')
    of_legal_age = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
