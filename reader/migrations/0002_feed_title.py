# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feed',
            name='title',
            field=models.CharField(default=b'News', max_length=300),
            preserve_default=True,
        ),
    ]
