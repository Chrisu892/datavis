from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.views import generic
from .models import *

from datetime import datetime, timezone
import json
import pandas as pd
import numbers


def get_graphs():
  """Get all live graphs"""
  return Graph.objects.all().order_by('menu_order').filter(status='live')

def timestamp(dt):
  return dt.replace(tzinfo=timezone.utc).timestamp() * 1000


class IndexView(generic.ListView):
  model = Page
  template_name = 'datavis/layouts/index.html'

  def get(self, request):
    page = get_object_or_404(Page, slug = 'home')
    return render(request, 'datavis/layouts/index.html', {
      'page': page,
      'graphs': get_graphs()
    })


def api(request):
  chartType = request.GET.get('type')
  chartSource = request.GET.get('source')
  response = {'series': []}

  df = pd.read_csv('static' + chartSource, sep=',', index_col=False)

  counter = 0


  if (chartType == 'xy'):
    for (row_name, row_data) in df.iterrows():
      series = {'name': row_data[0], 'data': []}

      for (col_name, col_data) in df.items():
        
        if (isinstance(col_data[counter], numbers.Number)):
          series['data'].append({
            'category': col_name,
            'value1': col_data[counter]
          })
          
      response['series'].append(series)
      counter += 1


  if (chartType == 'pie'):
    counter = 0
      
    for (col_name, col_data) in df.items():
      if (counter == 0):
        categories = col_data.to_list()
        
      else:
        series = {'name': None, 'data': []}
        counter2 = 0
        other = 0

        for value in col_data.to_list():
          if value < 1:
            other += value
            
          else:
            series['name'] = col_name
            series['data'].append({
              'category': categories[counter2],
              'value1': value
            })

          counter2 += 1
          
        if (other > 0):
          series['name'] = col_name
          series['data'].append({
            'category': 'Other',
            'value1': other
          })
          
        response['series'].append(series)

      counter += 1


  if (chartType == 'radar'):
    series = {'name': None, 'data': []}
    otherSeries = {'name': 'Other', 'data': []}
    counter = 0

    for (row_name, row_data) in df.iterrows():
      series = {'name': row_data[0], 'data': []}
      other = 0

      for (col_name, col_data) in df.iteritems():
        if (isinstance(col_data[counter], numbers.Number)):

          if (col_data[counter] > 0.3):
            series['data'].append({
              'category': col_name,
              'value1': col_data[counter]
            })

          else:
            other += col_data[counter]

      if (other == 0):
        response['series'].append(series)

      counter += 1
    
  response = json.dumps(response)

  return HttpResponse(response)