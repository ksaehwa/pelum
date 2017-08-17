#!C:\Windows\py.exe
#-*- coding: utf-8 -*-
import cgi
import cgitb
import re
import sys
from html.parser import HTMLParser
from Translator  import *

#Global Variable.
IDList = []

class MyHtmlParser( HTMLParser ):
     def handle_starttag(self, tag, attrs):
         if tag == 'div':
            if attrs[0][0]=='id':
                IDList.append(attrs)


    
if __name__ =='__main__':
    cgitb.enable()
    print("Content-Type: text/html\r\n\r\n")
    print("<html><head></head><body></body></html>\r\n\r\n")
    ATTRID = 0
    ATTRVAL = 1
    ATTRNAME = 2
    ATTRFROM = 3
    ATTRTO = 4
    
    base_resources = []
    
    parser = MyHtmlParser()
    fp = open("./resource/Lum.xml","r")
    parser.feed( fp.read() )
    fp.close()
    
    for obj in IDList:
        element = Element()
        element.id = obj[ATTRID][ATTRVAL]
        element.name = obj[ATTRNAME][ATTRVAL]
        element.data_from = obj[ATTRFROM][ATTRVAL]
        element.data_to = obj[ATTRTO][ATTRVAL]
        base_resources.append(element)
       
    del element
    
    element = Element()
    element.id = "BaseCanvas"
    element.name = ""
    element.data_target = ""
    translator = Translator(element)
    del element
     
    translator.treeStructurization(base_resources)
    result = translator.translating();
    
    print(result.html)
    print(result.view)
    print(result.control)
    print(result.model) 
    
    print('saving index.html...')
    fp = open('../mwa/index.html','w')
    fp.write(result.html)
    fp.close()
    
    print('saving view.js...')
    fp = open('../mwa/view.js','w')
    fp.write(result.view)
    fp.close()
    
    print('saving event.js...')
    fp = open('../mwa/event.js','w')
    fp.write(result.control)
    fp.close()
    
    print('saving db.js...')
    fp = open('../mwa/db.js','w')
    fp.write(result.model)
    fp.close()
    
