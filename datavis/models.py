from django.db import models


STATUS = (
  ('live', 'Live'),
  ('draft', 'Draft')
)

GRAPH_TYPE = (
  ('xy', 'XY'),
  ('pie', 'Pie'),
  ('radar', 'Radar'),
  ('map', 'Map'),
  ('hierarchy', 'Hierarchy'),
  ('flow', 'Flow'),
  ('word', 'Word'),
  ('venn', 'Venn')
)

def read_file():
  return 'Read file'


class File(models.Model):
  title = models.CharField(max_length=255, null=False)
  description = models.CharField(max_length=255, null=False)
  file = models.FileField(null=True, upload_to='files/')
  date_published = models.DateTimeField('date published')

  def __str__(self):
    return self.title


class Page(models.Model):
  title = models.CharField(max_length=255, null=False)
  tagline = models.CharField(max_length=255, null=False)
  slug = models.SlugField(max_length=255, null=True)

  def __str__(self):
    return self.title


class Graph(models.Model):
  title = models.CharField(max_length=255, null=False)
  tagline = models.CharField(max_length=255, null=False)
  date_published = models.DateTimeField('date published')
  menu_order = models.IntegerField(default=1)
  type = models.CharField(max_length=11, choices=GRAPH_TYPE, default='xy')
  status = models.CharField(max_length=11, choices=STATUS)
  document_file = models.ForeignKey(File, null=True, related_name='graph_document_file', on_delete=models.DO_NOTHING)


  def __str__(self):
    return self.title