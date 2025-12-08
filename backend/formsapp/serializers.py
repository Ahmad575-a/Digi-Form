from rest_framework import serializers
from .models import Form, Field, Submission, Answer
from django.db import transaction

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'label', 'type', 'required', 'order', 'options']

class FormSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Form
        fields = ['id', 'title', 'description', 'is_active', 'created_by', 'created_at', 'updated_at', 'fields']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])
        form = Form.objects.create(created_by=self.context['request'].user, **validated_data)
        for i, f in enumerate(fields_data):
            if 'order' not in f:
                f['order'] = i
            Field.objects.create(form=form, **f)
        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        if fields_data is not None:
            instance.fields.all().delete()
            for i, f in enumerate(fields_data):
                if 'order' not in f:
                    f['order'] = i
                Field.objects.create(form=instance, **f)
        return instance

class AnswerSerializer(serializers.ModelSerializer):
    field = serializers.PrimaryKeyRelatedField(queryset=Field.objects.all())

    class Meta:
        model = Answer
        fields = ['field', 'value']


class SubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    user = serializers.ReadOnlyField(source='user.username')
    form_title = serializers.ReadOnlyField(source='form.title')

    class Meta:
        model = Submission
        fields = ['id', 'form', 'form_title', 'user', 'submitted_at', 'updated_at', 'answers']
        read_only_fields = ['id', 'user', 'submitted_at', 'updated_at', 'form_title']

    def validate(self, attrs):
        form = attrs.get('form') or getattr(self.instance, 'form', None)
        answers = self.initial_data.get('answers', [])

        if not form:
            raise serializers.ValidationError('Form is required.')

        # Ensure all referenced fields belong to this form
        field_ids = {a.get('field') for a in answers if isinstance(a, dict)}
        if field_ids:
            count = form.fields.filter(id__in=field_ids).count()
            if count != len(field_ids):
                raise serializers.ValidationError('One or more fields do not belong to the selected form.')

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        user = self.context['request'].user
        submission = Submission.objects.create(user=user, **validated_data)

        for a in answers_data:
            Answer.objects.create(submission=submission, **a)

        return submission

    @transaction.atomic
    def update(self, instance, validated_data):
        # update as full replace of answers its for teachers and admins
        answers_data = validated_data.pop('answers', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        if answers_data is not None:
            instance.answers.all().delete()
            for a in answers_data:
                Answer.objects.create(submission=instance, **a)

        return instance

class FormStatsSerializer(serializers.Serializer):
    form_id = serializers.IntegerField()
    title = serializers.CharField()
    is_active = serializers.BooleanField()
    total_submissions = serializers.IntegerField()
    unique_students = serializers.IntegerField()
    submissions_by_class = serializers.DictField(
        child=serializers.IntegerField()
    )
    first_submission_at = serializers.DateTimeField(allow_null=True)
    last_submission_at = serializers.DateTimeField(allow_null=True)