#
# Configuration... 
#
VERBOSE = True

#
# Program...
#

from txjsonrpc.web import jsonrpc
from twisted.web import server
from twisted.internet import reactor
from twisted.web import static

#
# add ogg mime type here...
#
dct = static.File.contentTypes
dct[".ogv"] = "video/ogg"

from twisted.web.static import File
from twisted.web.server import Site
from twisted.web import resource

import bson
import base64
import os
import json
import socket

# Create toplevel web resource...
parent = resource.Resource()

# Create static resources part of site...
staticfiles = File(".")
parent.putChild("site", staticfiles )

#reactor.listenTCP(8084, server.Site(Math()))
factory = Site(parent)
reactor.listenTCP(8080, factory )

# global data
count_init = 0
state = [ \
	"{ type:'page', title:'PAGE TITLE' }", \
	"{ name: 'list2', type:'list', x:'20', y:'20', height:'200', width:'200', interval:'1000',scroll_or_refresh:'scroll', prepend_or_append:'prepend' }", \
	"{ name: 'list1', type:'list', x:'320', y:'20', height:'200', width:'200', interval:'1000', scroll_or_refresh:'refresh',prepend_or_append:'prepend' }", \
	"{ name: 'map1', type:'map', x:'300', y:'250', height:'300', width:'300', interval:'1000',tree: 'tree1', top:'52.54', bottom:'52.50', left:'13.39', right:'13.43' }",\
	"{ name: 'tree1', type:'tree', x:'40', y:'250', height:'200', width:'200', interval:'1000'," + \
            						" paths: [ ['yo',[13.39,52.50,13.43,52.54]], " + \
                                                        "['yo','ho',[13.39,52.50,13.41,52.52] ], " + \
                                                        "['yo','ho','a',[13.391,52.50,13.401,52.51] ]," + \
                                                        "['yo','ho','b',[13.392,52.50,13.402,52.51] ]," + \
                                                        "['yo','ho','c',[13.393,52.50,13.403,52.51] ]," + \
                                                        "['yo','ho','d',[13.394,52.50,13.404,52.51] ]," + \
                                                        "['yo','ho','e',[13.395,52.50,13.405,52.51] ]," + \
                                                        "['yo','ho','f',[13.396,52.50,13.406,52.51] ]," + \
                                                        "['yo','ho','g',[13.397,52.50,13.407,52.51] ]," + \
                                                        "['yo','ho','h',[13.398,52.50,13.408,52.51] ]," + \
                                                        "['yo','ho','i',[13.399,52.50,13.409,52.51] ]," + \
                                                        "['yo','ho','j',[13.3991,52.50,13.4091,52.51] ]," + \
                                                        "['yo','ho','k',[13.3992,52.50,13.4092,52.51] ]," + \
                                                        "['yo','ho','l',[13.3993,52.50,13.4093,52.51] ] ] }", \
	"{ name: 'my_control', type:'control', title:'the default title', x:'650', " + \
                                                "y:'300', height:'200', width:'70', " + \
                                                "buttons:[{name:'run'},{name:'stop'}," + \
                                                "{name:'pause',toggle_name:'resume'}," + \
                                                "{name:'reset'},{name:'restart'},{name:'refresh'} ] }", \
	"{ name: 'chart1', type:'chart', title:'My Title', " + \
                                                "window_points:'10', " + \
                                                "x:'580', y:'20', height:'200', width:'400', interval:'1000', " + \
                                                "points_or_lines_or_area:'area', " + \
                                                "series_name:['one','two'], chart_start:'fill', shift:'no'," + \
                                                "stacking:'no' }", \
        "done" ]

list_state = { "list1":"[ 'its list1','this is the stuff you print out', 'this too' ]", \
	"list2":"[ 'its list2', 'this is the stuff you print out', 'this too' ]" }

map_state = { "map1": "[" + \
                      "{'color':'ff0000', 'transparency':'1.0'," + \
                                                "'shape':'circle','border':'0px','border_color':'00ff00'," + \
                                                "'size':'10px'," + \
                                                "'lat':'13.41'," + \
                                                "'long':'52.52' }," + \
                                                "{'color':'00ff00', 'transparency':'0.7'," + \
                                                "'shape':'circle','border':'1px','border_color':'0000ff'," + \
                                                "'size':'12px'," + \
                                                "'lat':'13.4160'," + \
                                                "'long':'52.52' }," + \
                                                "{'color':'0000ff', 'transparency':'0.6'," + \
                                                "'shape':'square','border':'2px','border_color':'ff0000'," + \
                                                "'size':'14px',"+ \
                                                "'lat':'13.4220',"+ \
                                                "'long':'52.52' },"+ \
                                                "{'color':'ffff00', 'transparency':'0.4',"+ \
                                                "'shape':'square','border':'3px','border_color':'00ffff',"+ \
                                                "'size':'16px',"+ \
                                                "'lat':'13.4280',"+ \
                                                "'long':'52.52' },"+ \
                                                "{'color':'ffff00', 'transparency':'1.0',"+ \
                                                "'shape':'image','image':'smallfish.png',"+ \
                                                "'border':'0px','border_color':'00ffff'," + \
                                                "'size':'16px',"+ \
                                                "'lat':'13.41',"+ \
                                                "'long':'52.5140' } ]" }

tree_state = { "tree1": '[ [ "yo","ho","no" ], [ "yo", "ho", "lo" ] ]' }

chart_state = { "chart1": "[ {series:0,y:'12.4'}, {series:0,y:'13.5'},{series:1,y:'12.0'} ]" }

class main_init(resource.Resource):

	def __init__(self):
		resource.Resource.__init__(self)

	def render(self, request):
		global count_init, state
		count_init = 1
		return state[0]
	
class main_init_next(resource.Resource):

	def __init__(self):
		resource.Resource.__init__(self)

	def render(self, request):
		global count_init, state
		print count_init
                data = state[ count_init ]
                count_init += 1
                if ( count_init == len(state) ):
			count_init = 0
		print "returning-->" + data
                return data

class list_request(resource.Resource):

        def __init__(self):
                resource.Resource.__init__(self)

        def render(self, request):
		global list_state
		return list_state[ request.args["name"][0] ]

class tree_request(resource.Resource):

        def __init__(self):
                resource.Resource.__init__(self)

        def render(self, request):
		global tree_state
		if request.args.has_key("init"):	
			return tree_state[ request.args["name"][0] ]
		else:	
			return "'done'"

class map_request(resource.Resource):

        def __init__(self):
                resource.Resource.__init__(self)

        def render(self, request):
		global map_state
		if request.args.has_key("init"):
			return map_state[ request.args["name"][0] ]
		else:
			return "done"

class chart_request(resource.Resource):

        def __init__(self):
                resource.Resource.__init__(self)

        def render(self, request):
		global chart_state
		return chart_state[ request.args["name"][0] ]

class admin_request(resource.Resource):
	
	def __init__(self):
		resource.Resource.__init__(self)

	def render(self, request):
		return "wait"


parent.putChild("main_init", main_init() )
parent.putChild("main_init_next", main_init_next() )
parent.putChild("list_data", list_request() )
parent.putChild("tree_data", tree_request() )
parent.putChild("map_data", map_request() )
parent.putChild("admin", admin_request() )
parent.putChild("chart_data", chart_request() )

#
# setup a timer callback...
#
def loop():
	reactor.callLater( 1.0, loop)  
reactor.callLater( 1.0, loop )


#
# Use this code to start as main...
#
print "INFO: Starting reactor..."
reactor.run()

