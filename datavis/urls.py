from django.urls import path
from . import views

app_name = 'datavis'
urlpatterns = [
  path('', views.IndexView.as_view(), name='index'),
  path('api/', views.api, name='api'),
]
