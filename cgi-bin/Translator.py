from Result import *
from CompileTemplates import *
class Element:
    def __init__(self):
        self.id = ''
        self.name = ''
        self.data_from=''
        self.data_to = ''
        self.multi_check=''
        self.style = 'default'

class TemplatesGenerator:
    
    def getCONTemplate(self):
        pass
    def getPOPTemplate(self):
        pass
    def getSETTemplate(self):
        pass
    def getOPTTemplate(self):
        pass



class Node:
    def __init__(self,obj):
        self.id = obj.id
        self.name = obj.name
        self.data_from = obj.data_from
        self.data_to = obj.data_to
        self.multi_check = obj.multi_check
        self.children = []

class Translator:
    def __init__(self,obj):
       self.root = Node(obj)
       self.stack = []
       self.curStk = []
       self.output = Result()
       self.Compiler = CompileTemplates()
       
    #private function in Translator Class.
    def _showAll(self):
        root = self.root
        stk = []
        if root != None:
            stk.append(root)
            while( len(stk) != 0 ):
                top = stk.pop()
                for child in top.children:
                    stk.append(child)
                    print("showAll: ",child.id)
            
    def _divisionParentId(self,obj):
        id = obj.id
        arr = id.split('_')
        arr_len = len(arr)
        print(arr_len, arr[arr_len-2], arr[arr_len-1])
        return arr[arr_len-2]
    
    def _addChild(self,obj,parentId): 
        root = self.root
        if root != None:
          self.stack.append( root )
          while( len(self.stack) != 0):
              top = self.stack.pop()
              for child in top.children:
                  self.stack.append(child)
                  self.curStk.append(child.id)
              
              if top.id == parentId:
                  try:
                      self.curStk.indexof(obj.id)
                  except:
                      top.children.append( Node(obj) )
        return True
        
    def treeStructurization(self,objects):
        print("tree structurization!\n")
        for obj in objects:
            temp = obj.id.split('_')
            temp_len = len(temp)
            # ex) base_Pop1 --> base, Pop1
            
            obj.id = temp[-1]
            # 2th parameter is parent id.
            self._addChild(obj,temp[-2])
        #self.root = Node()
        self._showAll()
        return True
    
    def translating(self):
        print("translating\n")
        root = self.root
        stk = []
        isNav=0
        if root != None:
            stk.append(root)
            while( len(stk) != 0 ):
                top = stk.pop()
                for child in top.children:
                    stk.append(child)
                    temp_id = child.id.split('_')
                    if( temp_id[len(temp_id)-1][:3] =="Con" ):
                        #make code.
                        for c in child:
                            if c not in Nav:
                                isNav = 0
                            else:
                                isNav = 1
                        self.Compiler.makeConTemplate()
                        print( temp_id[len(temp_id)-1] )
                    elif(temp_id[len(temp_id)-1][:3] =="Pop"):
                        #make code about Population.
                        print("top: ",top.id,"child:", temp_id[len(temp_id)-1] )
                        print(child.children[0])
                        self.Compiler.makePopTemplate(child,isNav)
                    elif(temp_id[len(temp_id)-1][:3] =="Set"):
                        #make code of Setting.
                        print( temp_id[len(temp_id)-1] )
                        self.Compiler.makeSetTemplate(child)
                    print("showAll: ",child.id, child.name, child.data_from, child.data_to)
        
        self.Compiler.output.html += '</body>\n</html>'
        
        return self.Compiler.output
        