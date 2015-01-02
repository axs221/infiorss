import logging
logger = logging.getLogger(__name__)

from django.conf.urls import patterns, include, url
from django.contrib import admin
from reader import views
from reader import models
from rest_framework import routers, serializers, viewsets
from django.views.generic import TemplateView

class FeedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Feed
        fields = ('id', 'uri','title')

class FeedViewSet(viewsets.ModelViewSet):
    queryset = models.Feed.objects.all()
    serializer_class = FeedSerializer

router = routers.DefaultRouter()
router.register(r'feeds', FeedViewSet)

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^client/', include('client.urls')),
    url(r'^api/', include(router.urls)),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^showtime/', views.showtime),
    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # url(r'^reader/', include('reader.urls')),
]
