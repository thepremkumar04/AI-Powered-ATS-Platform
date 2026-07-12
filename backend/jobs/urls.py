from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, ApplicationViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet)

# Ikkada kothaga "basename='application'" add chesam 👇
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('api/', include(router.urls)),
]