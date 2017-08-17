class Result:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Result,cls).__new__(cls, *args, **kwargs)
        return cls._instance
    def __init__(self):
        self.html="""
<!DOCTYPE html>
<html>
    <head>
    <title>WebAPP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8">
    <LINK REL="SHORTCUT ICON" href="/favicon.ico"/>
    <link rel="stylesheet" href="http://220.67.124.134/mobileWebAPPs/alarm/css/alarm.css">
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
    
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
    <script src='./view.js'></script>
    <script src='./db.js'></script>
    <script src='./event.js'></script>
    <script> var curIdx; </script>
    </head>
    <body>        
"""
        self.control="""
$(document).ready(function(){
    //POPEVENT
    
    //SETEVENT
    
});
"""
        self.view=""
        self.model=""