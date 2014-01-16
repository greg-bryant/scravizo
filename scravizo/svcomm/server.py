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
state = [  "{ name: 'list1', type:'list', x:'20', y:'100', height:'200', width:'50', interval:'1000'  }", \
          "{ name: 'list2', type:'list', x:'400', y:'300', height:'200', width:'50', interval:'1000' }", \
          "done" ]
list_state = "[ 'this is the stuff you print out', 'this too' ]"

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
		print "list request", request
		global list_state
		return list_state

parent.putChild("main_init", main_init() )
parent.putChild("main_init_next", main_init_next() )
parent.putChild("list", list_request() )

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

