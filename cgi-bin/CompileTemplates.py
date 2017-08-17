from Result import *
import sys
import json
import re
class CompileTemplates:
    def __init__(self):
        self.output = Result()
        
    #return container template.
    def makeConTemplate(self,obj):
        fp = open("./templates/container/html/container",'r')
        html = fp.read()
        fp.close()
        html = output.replace("UID", obj.id)
        print( html )
        self.output.html +=html+'\n'  
        
    def makePopTemplate(self,obj,isNav):
        # Make HTML
        # Find UID and change UID to obj.id
        print("opening html template...")
        if not isNav:
            fp = open("./templates/population/html/population",'r')
        else:
            fp = open("./template/population/html/OLpopulation",'r')
        html = fp.read()
        fp.close()
        html = html.replace("UID",obj.id)
        html = html.replace("LUMNAME",obj.name)
        if obj.data_to:
            t = obj.data_to.split('_')
            html = html.replace("LUMTO",t[-1])
        if obj.data_from:
            f = obj.data_to.split('_')
            html = html.replace("LUMFROM",f[-1])
            
        self.output.html+=html+'\n'
        print(self.output.html)
        
        # Make JS file.
        # open a view.js & event.js template.
        # view js
        print("opening view.js template...")
        fp = open("./templates/population/viewJS/populationJS",'r')
        vjs = fp.read()
        fp.close()
        vjs = vjs.replace("UID",obj.id)
        vjs = vjs.replace("LUMNAME",obj.name)
        t = obj.data_to.split('_')
        vjs = vjs.replace("TO",t[-1])
        
        print("opening event.js template...")
        fp = open("./templates/population/eventJS/UIEvent",'r')
        ejs = fp.read()
        fp.close()
        ejs = ejs.replace("UID",obj.id)
        ejs = ejs.replace("LUMNAME",obj.name)
                
        INDEX = self.output.control.find("//POPEVENT")
        self.output.control =  self.output.control[:INDEX+10]+'\t\n'+ejs+self.output.control[INDEX+10:]
                
        fp = open("./templates/population/eventJS/LEEvent",'r')
        ejs = fp.read()
        fp.close()
        self.output.control += '\t\n' + ejs
        
        print("opening db.js template...")
        fp = open("./templates/db",'r')
        self.output.model = fp.read()
        fp.close()
        
        dINDEX = self.output.model.find("//POPDB")+7
        fp = open("./templates/population/dbJS/population",'r')
        djs = fp.read()
        fp.close()
        self.output.model = self.output.model[:dINDEX]+'\n'+djs+'\n'+self.output.model[dINDEX:]
        
        
        
        if len(obj.children) != 0 :
            vjs_temp = '' # view.js  
            ejs_temp = '' # event.js 
            djs_temp = '' # db.js 
            
            tglFunction = None
            # obj is parent of child.
            for child in obj.children:
                if 'Ins' in child.id:
                    vINDEX = vjs.find("//"+obj.id+"Instance")
                    Ins = open('./templates/population/viewJS/Instance/Instance','r')
                    vjs_temp = Ins.read()
                    Ins.close()
                    vjs_temp = vjs_temp.replace('LUMNAME',child.name) 
                    
                elif 'Tgl' in child.id:
                    # view js
                    vINDEX = vjs.find("//"+obj.id+"Togglable")
                    Tgl = open('./templates/population/viewJS/Togglable/vjsTogglable','r')
                    vjs_temp = Tgl.read()
                    Tgl.close()
                    vjs_temp = vjs_temp.replace("LUMNAME",child.name)
                    vjs_temp,tglFunction = vjs_temp.split("\n\n")
                    
                    # event js
                    Tgl = open('./templates/population/eventJS/Togglable/ejsTogglable','r')
                    ejs_temp = Tgl.read()
                    Tgl.close()
                    ejs_temp = ejs_temp.replace("LUMNAME",child.name)
                    
                    eINDEX = self.output.control.find("//bLETGL")+8
                    self.output.control = self.output.control[:eINDEX] +'\t\n'+ ejs_temp + self.output.control[eINDEX:]
                    
                    # db js
                    Tgl = open("./templates/population/dbJS/Togglable/djsTogglable",'r')
                    djs_temp = Tgl.read()
                    Tgl.close()
                    djs_temp = djs_temp.replace("LUMNAME",child.name)
                    
                    dINDEX =  self.output.model.find("//TGLDB")+8
                    self.output.model = self.output.model[:dINDEX]+'\n'+djs_temp+self.output.model[dINDEX:]
                
                if tglFunction != None :
                    vjs = tglFunction +'\n'+ vjs[:vINDEX] + vjs_temp + '\n' + vjs[vINDEX:] 
                else:
                    vjs = vjs[:vINDEX] + vjs_temp + '\n' + vjs[vINDEX:]
                tglFunction = None
        self.output.view += vjs         
        
    def _getJSONdata(self,pim,id):
        for obj in pim:
            if id in obj['id']:
                return obj['Name'],obj['Values']
            
    def _getJSONMulCheck(self,pim,id):
        for obj in pim:
            if id in obj['id']:
                return obj['MulCheck']
        
    def _checkPIMvalue(self,pim):
        if pim:
            if ',' in pim:
                pv = pim.split(',')
                if 'on'or 'On' or 'ON' in pv[0]:
                    true_value = pv[0]
                    false_value = pv[1]
                    return true_value,false_value
                else: 
                    print('FalseValue')
                
        pass            
    def makeSetTemplate(self,obj):
        # Make HTML
        fp = open('./templates/settings/html/settings','r')
        html = fp.read()
        fp.close()
        html = html.replace("UID",obj.id)
        
        if obj.data_from:
            f = obj.data_from.split("_")
            html = html.replace("LUMFROM",f[-1])
            self.output.html += html
        
        # event.js about settings
        fp = open('./templates/settings/eventJS/ejsSettings','r')
        ejs = fp.read()
        fp.close()
        ejs = ejs.replace("UID",obj.id)
        eINDEX = self.output.control.find('//SETEVENT')+10
        self.output.control = self.output.control[:eINDEX]+'\n'+ejs+self.output.control[eINDEX:] 
        
        # view.js about settings
        fp = open('./templates/settings/viewJS/vjsSettings','r')
        vjs = fp .read()
        fp.close()
        self.output.view += '\n'+vjs
        
        # db.js about settings
        fp = open('./templates/settings/dbJS/djsSettings','r')
        djs = fp.read()
        fp.close()
        dINDEX = self.output.model.find("//SETDBJS")+10
        self.output.model = self.output.model[:dINDEX] +'\n'+ djs +self.output.model[dINDEX:]
                
        
        # event,db,view js about child element.
        if len( obj.children ) != 0:
            # load pim data from ./resource/pim.json
            print("opening pim data...")
            pim_fp = open("./resource/Pim.json",'r')
            pim = json.loads(pim_fp.read()) 
            pim_fp.close()
            
            for child in obj.children:
                if 'Sel' in child.id:
                    Name,Values = self._getJSONdata(pim,child.id)
                    
                    # load the html template of selectable
                    c = self._getJSONMulCheck(pim,child.id)
                    if c:
                        fp = open("./templates/selectable/html/mselectable",'r')
                    else:
                        fp = open("./templates/selectable/html/selectable",'r')
                    Sel = fp.read()
                    fp.close()
                    
                    Sel = Sel.replace("LUMNAME",child.name)
                    if ':' in Values:
                        # range value
                        v = Values.split(':')
                        Sel = Sel.replace("PIMFIRST",v[0])
                        Sel = Sel.replace("PIMLAST",v[1])
                        Sel = Sel.replace("PIMMULTI",'null')
                        
                    else:
                        # multi value
                        Sel = Sel.replace("PIMFIRST",'null')
                        Sel = Sel.replace("PIMLAST",str( len(Values.split(',')) ) )
                        Values = Values.split(',')
                        temp=""
                        for val in Values:
                            temp += "'"+val+"',"
                        Sel = Sel.replace("PIMMULTI",'['+temp[:-1]+']')
                        
                    sINDEX = self.output.html.find("<!--"+obj.id+"contents-->")
                    self.output.html = self.output.html[:sINDEX]+ Sel+'\t\n' + self.output.html[sINDEX:]
                    
                    # view.js. appendOption
                    fp = open('./templates/selectable/viewJS/vjsSelectable','r')
                    vjs = fp.read()
                    fp.close()
                    vjs = vjs.split("\n\n")
                    vjs[0] = vjs[0].replace('LUMNAME',child.name)
                    if self.output.view.find("appendOption") == -1:
                        self.output.view += '\n'+ vjs[-1]
                    vINDEX = self.output.view.find("//pSPSEL")+8
                    self.output.view = self.output.view[:vINDEX]+'\n'+vjs[0]+self.output.view[vINDEX:]
                    
                    # db.js
                    fp = open('./templates/selectable/dbJS/djsSelectable','r')
                    djs = fp.read()
                    fp.close()
                    djs = djs.replace("LUMNAME",child.name)
                    pn, pv = self._getJSONdata(pim,child.id)
                    # check, pv(pim value) is multi?
                    if ':' in pv:
                        pv = pv[0]
                    else:
                        pv = pv.split(',')
                        pv = '\''+pv[0]+'\''
                    djs = djs.replace("PIMFIRSTVALUE",pv)
                    dINDEX = self.output.model.find('//DBSEL')+7
                    self.output.model = self.output.model[:dINDEX]+'\n'+djs+self.output.model[dINDEX:]
                   
                    # event.js
                    fp = open('./templates/selectable/eventJS/ejsSelectable','r')
                    ejs = fp.read()
                    fp.close()
                    ejs = ejs.replace("LUMNAME",child.name)
                    eINDEX = self.output.control.find('//SETSEL')+8
                    self.output.control = self.output.control[:eINDEX]+'\n'+ejs+self.output.control[eINDEX:]
                    
                elif 'Tgl' in child.id:
                    # html 
                    fp = open('./templates/settings/togglable/html/togglable','r')
                    Tgl = fp.read()
                    fp.close()
                    Tgl = Tgl.replace("LUMNAME",child.name)
                    pn,pv = self._getJSONdata(pim,child.id)
                    # check pim value. which is true or false.
                    true_value,false_value = self._checkPIMvalue(pv)
                    Tgl = Tgl.replace("PIMTRUE",true_value)
                    Tgl = Tgl.replace("PIMFALSE",false_value)
                    #find <!--UIDcontents-->
                    sINDEX = self.output.html.find("<!--"+obj.id+"contents-->")
                    self.output.html = self.output.html[:sINDEX]+ Tgl+'\t\n' + self.output.html[sINDEX:]
                    
                    #view js
                    fp = open('./templates/settings/togglable/viewJS/vjsTogglable','r')
                    vjs = fp.read()
                    fp.close()
                    vjs = vjs.replace('LUMNAME',child.name)
                    vINDEX = self.output.view.find("//pSPTGL")+8
                    self.output.view = self.output.view[:vINDEX]+'\n'+vjs+self.output.view[vINDEX:]
                    
                    #event js
                    fp = open('./templates/settings/togglable/eventJS/ejsTogglable','r')
                    ejs = fp.read()
                    fp.close()
                    ejs = ejs.replace('LUMNAME',child.name)
                    eINDEX = self.output.control.find("//SETTGL")+8
                    self.output.control = self.output.control[:eINDEX]+'\n'+ ejs + self.output.control[eINDEX:] 
                    
                    #db js
                    fp = open('./templates/settings/togglable/dbJS/djsTogglable','r')
                    djs = fp.read()
                    fp.close()
                    djs = djs.replace('LUMNAME',child.name)
                    dINDEX = self.output.model.find("//DBTGL")+7
                    self.output.model = self.output.model[:dINDEX]+'\n'+djs+self.output.model[dINDEX:]
                    
                    pass
                
        
        """print("----- view.js -----")
        print(self.output.view)
        print("----- event.js -----")
        print(self.output.control)
        print("----- db.js -----")
        print(self.output.model)
        print("----- html -----")
        print(self.output.html)"""
        
        # +- view js
        # +- event js
        # +- db js
        
    