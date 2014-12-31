import logging
logger = logging.getLogger(__name__)

from django.conf.urls import patterns, include, url
from django.contrib import admin
from reader import views
from reader import models
from rest_framework import routers, serializers, viewsets
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = patterns('',
	(r'^foome$', TemplateView.as_view(template_name='index.html')),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
