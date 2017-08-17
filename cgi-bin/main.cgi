import cgi
import cgitb
import sys
cgitb.enable();

fo = open('./result.txt','wb');
fo.write(""" morning!\n""");
fo.close();

