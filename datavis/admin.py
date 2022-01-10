from django.contrib import admin
from .models import *


class PageAdmin(admin.ModelAdmin):
  fieldsets = [
    ('Base Details', {'fields': ['title', 'slug', 'tagline']}),
  ]
  list_display = ('title', 'slug',)


class GraphAdmin(admin.ModelAdmin):
  fieldsets = [
    ('Base Details', {'fields': ['title', 'tagline']}),
    ('Settings', {'fields': ['document_file', 'type']}),
    ('Display Options', {'fields': ['menu_order', 'status', 'date_published']}),
  ]
  list_display = ('title', 'date_published', 'type', 'status')
  ordering = ('menu_order',)


class FileAdmin(admin.ModelAdmin):
  fieldsets = [
    ('Base Details', {'fields': ['title', 'description', 'date_published']}),
    ('Document', {'fields': ['file']}),
  ]
  list_display = ('title', 'date_published')


admin.site.register(Page, PageAdmin)
admin.site.register(Graph, GraphAdmin)
admin.site.register(File, FileAdmin)