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
staticfiles = File("..")
parent.putChild("site", staticfiles )

#reactor.listenTCP(8084, server.Site(Math()))
factory = Site(parent)
reactor.listenTCP(8080, factory )

# global data
main_init = 0
state = [ \
	"{ name: 'list1', type:'list', x:'20', y:'100', height:'200', width:'200', interval:'1000'  }", \
	"{ name: 'list2', type:'list', x:'20', y:'400', height:'200', width:'200', interval:'1000' }", \
	"{ name: 'map1', type:'map', x:'400', y:'100', height:'200', width:'150', interval:'1000' }", \
	"{ name: 'tree1', type:'tree', x:'400', y:'400', height:'200', width:'150', interval:'1000' }", \
          "done" ]
list_state = { "list1":"[ 'its list1','this is the stuff you print out', 'this too' ]", \
	"list2":"[ 'its list2', 'this is the stuff you print out', 'this too' ]" }

tree_state = { "tree1": '[ [ "yo","ho","no" ], [ "yo", "ho", "lo" ] ]' }

class main_init(resource.Resource):

	def __init__(self):
		resource.Resource.__init__(self)

	def render(self, request):
		global main_init, state
		main_init = 1
		return state[0]
	
class main_init_next(resource.Resource):

	def __init__(self):
		resource.Resource.__init__(self)

	def render(self, request):
		global main_init, state
                data = state[ main_init ]
                main_init += 1
                if ( main_init == len(state) ):
			main_init -=1
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
		print "TREER", type(request.args), request.args.keys()
		if request.args.has_key("init"):	
			return tree_state[ request.args["name"][0] ]
		else:	
			return "'done'"

class map_request(resource.Resource):

        def __init__(self):
                resource.Resource.__init__(self)

        def render(self, request):
		global map_state
		print "map request", request, type(request.path), request.path, type(request.uri), request.uri, request.args
		return "done"


parent.putChild("main_init", main_init() )
parent.putChild("main_init_next", main_init_next() )
parent.putChild("list_data", list_request() )
parent.putChild("tree_data", tree_request() )
parent.putChild("map_data", map_request() )

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

