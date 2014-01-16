
var _LISTSJS = null;

var _item_counter = 0;

var _lists_str = {
			'list1':
				{ "init":
					"{ name: 'list1', type:'list', x:'250', y:'50', height:'200', width:'200', interval:'1000'," +
                                                "scroll_or_refresh:'scroll'," +
                                                "prepend_or_append:'prepend'," +
                                                "z:'30'," +
                                                "page:[2] }",
                                                //"font:'sans-serif'," +
                                                //"font_size:'20px'," +
                                                //"text_color:'#FFFF00'," +
                                                //"background_color:'#FFFFFF' ",
				  "data": function() {
					return "[ 'its list1','this is the stuff you print out', 'this too', '" + (_item_counter++) + "' ]";
						     }
				},
			'list2':
                        	{ "init": 
					"{ name: 'list2', type:'list', x:'500', y:'50', height:'200', width:'200', interval:'1000'," +
                                                "scroll_or_refresh:'scroll'," +
                                                "prepend_or_append:'prepend'," +
                                                "z:'30'," +
                                                "page:[2] }",
                                                //"font:'sans-serif'," +
                                                //"font_size:'20px'," +
                                                //"text_color:'#FFFF00',"
				  "data": function() {
					return "[ 'its list2','this is the stuff you print out', 'this too', '" + (_item_counter++) + "' ]"
						     }
				}
			};

var _lists_test_script = [ 
	[ "init", 'list1', _lists_str['list1']['init'] ],
	[ "init", 'list2', _lists_str['list2']['init'] ],

	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],
	[ "data", 'list1', _lists_str['list1']['data'] ],
	[ "data", 'list2', _lists_str['list2']['data'] ],

	[ "data", 'list1', function() { return "done"; } ],
	[ "data", 'list2', function() { return "done"; } ]
			];

var _lists_test_idx = 0;

function _lists_peek_next_test()
{
	if ( _lists_test_idx == _lists_test_script.length )
		return false;
	else
		return _lists_test_script[ _lists_test_idx ];
}

function _lists_get_next_test()
{
	if ( _lists_test_idx == _lists_test_script.length )
		return false;
	else
	{
		var val = _lists_test_script[ _lists_test_idx ];
		_lists_test_idx++;
		return val;
	}	
}

var _lists_test = {
	'peek' : _lists_peek_next_test,
	'next' : _lists_get_next_test
		   };

function lists_script_init( )
{
	SOURCES[ SOURCES.length ] = _lists_test;
}
