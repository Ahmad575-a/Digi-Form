from django.contrib import admin
from .models import Form, Field

class FieldInline(admin.TabularInline):
    model = Field
    extra = 0

@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description')
    inlines = [FieldInline]

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('form', 'name', 'label', 'type', 'required', 'order')
    list_filter = ('type', 'required')
    search_fields = ('name', 'label', 'form__title')
