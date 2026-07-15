from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import register_user

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Ikkada 'api/' theesesi empty '' pettam. Idi direct ga jobs.urls ki connect avtundi.
    path('', include('jobs.urls')), 
    
    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register'),
]

# Development lo media files (Resumes) ni serve cheyyadaniki
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)