#!/opt/local/bin/python2.7
#
# Configuration...
#

IN_CSS = "../common/datatables/demo_table.css"
IN_CSS = "test.css"

OUT_JS = "out.js"

TEST = "/*\n comment\n */\n #hello.h yo.yo {\n yo;bo;\n }"

#
# Program...
#

import sys
from pyparsing import Word, alphas, alphanums, nestedExpr, OneOrMore, ZeroOrMore

def JOINR(t):
	return "".join( t.asList() )

def PA(s,l,t):
	allt = JOINR(t)
	print "PA->", s[l:10], len(t), allt, type(t), allt
	return t

# create parse expressions...
ident = Word(alphanums+'.'+'#' + '_')
ident.setParseAction( PA )

sel_phrase = OneOrMore( ident )
sel_phrase.setParseAction(  PA )

def_phrase = nestedExpr("{","}")
def_phrase.setParseAction(  PA )

comment_phrase = nestedExpr("/*","*/")
comment_phrase.setParseAction(  PA )

rule = ZeroOrMore(comment_phrase) + sel_phrase + def_phrase
rule.setParseAction( PA )

rules = OneOrMore( rule )

# tests...
if (False):
	print TEST
	out = rules.parseString( TEST )
	print len(out)

# read css...
if (True):
	out = rules.parseFile( IN_CSS )
	print len(out)
	#for item in out:
	#print "item->", item

