from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, default='')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_forms', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('label', models.CharField(max_length=200)),
                ('type', models.CharField(choices=[('text', 'Text'), ('textarea', 'Textarea'), ('number', 'Number'), ('select', 'Select'), ('checkbox', 'Checkbox'), ('radio', 'Radio'), ('date', 'Date')], default='text', max_length=20)),
                ('required', models.BooleanField(default=False)),
                ('order', models.PositiveIntegerField(default=0)),
                ('options', models.JSONField(blank=True, default=list)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='formsapp.form')),
            ],
            options={'ordering': ['order', 'id']},
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together={('form', 'name')},
        ),
    ]
