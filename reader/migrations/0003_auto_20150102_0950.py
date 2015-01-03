# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0002_feed_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feed',
            name='title',
            field=models.CharField(default=b'News', max_length=300, null=True, blank=True),
            preserve_default=True,
        ),
    ]
