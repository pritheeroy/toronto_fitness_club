# Generated by Django 4.1.3 on 2022-12-07 17:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('studios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClassSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
                ('coach', models.CharField(max_length=200)),
                ('start_date_time', models.DateTimeField()),
                ('end_time', models.TimeField()),
                ('enrolled', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=200)),
                ('classSession', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.classsession')),
            ],
        ),
        migrations.CreateModel(
            name='EnrolledUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('class_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.classsession')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ClassSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('coach', models.CharField(max_length=200)),
                ('start', models.DateTimeField()),
                ('end_time', models.TimeField()),
                ('reoccur_until', models.DateField()),
                ('capacity', models.PositiveIntegerField()),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='class_studio', to='studios.studio')),
            ],
        ),
        migrations.AddField(
            model_name='classsession',
            name='name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='class_name', to='classes.classset'),
        ),
    ]