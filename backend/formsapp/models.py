from django.conf import settings
from django.db import models

class Form(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_forms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Field(models.Model):
    class FieldType(models.TextChoices):
        TEXT = 'text', 'Text'
        TEXTAREA = 'textarea', 'Textarea'
        NUMBER = 'number', 'Number'
        SELECT = 'select', 'Select'
        CHECKBOX = 'checkbox', 'Checkbox'
        RADIO = 'radio', 'Radio'
        DATE = 'date', 'Date'

    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=100)
    label = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=FieldType.choices, default=FieldType.TEXT)
    required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    options = models.JSONField(blank=True, default=list)

    class Meta:
        unique_together = ('form', 'name')
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.form.title}:{self.name}'

class Submission(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f'Submission #{self.pk} by {self.user} for {self.form}'


class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers')
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='answers')
    value = models.TextField(blank=True, default='')

    class Meta:
        unique_together = ('submission', 'field')

    def __str__(self):
        return f'{self.submission_id}:{self.field.name}'
