from rest_framework import serializers
from .models import Form, Field

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
