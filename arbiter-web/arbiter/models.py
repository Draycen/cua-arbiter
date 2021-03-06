from __future__ import unicode_literals
from django.contrib import  admin
from django.db import models
from django.contrib.auth.models import Group
from mongoengine import *
import django.utils.timezone as timezone


#用例执行日志
class Run_Log (Document):
    meta = {
        'collection': 'log',
    }
    case_info = StringField(max_length=100)
    content =  StringField(max_length=100)

#运行日志信息模型
class Case_Run_Info (models.Model):
    log_id = models.UUIDField()
    case_name = models.TextField(max_length=200)
    run_time = models.DateTimeField()
    author = models.CharField(max_length=50)

    result = models.CharField(max_length=50,default='done')
    version = models.IntegerField(default='10000000')

#用例版本号信息
class Case_Version_Info(models.Model):
    case_name = models.TextField(max_length=200)#用例名，.py文件
    latest_version = models.IntegerField(default=10000000)#版本号 八位
    update_time = models.DateTimeField(default=timezone.now)
#运行记录
class Case_Save_Info(models.Model):
    case_name = models.TextField(max_length=200)#用例名+方法
    version = models.IntegerField(default=10000000)
    author = models.CharField(max_length=50)
    save_time = models.DateTimeField(default=timezone.now)

