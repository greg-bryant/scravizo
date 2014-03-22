
var _TREESJS = null;

var _trees_str = {
			'tree1':
				{ "init":
					"{ name: 'tree1', type:'tree', x:'240', y:'30', height:'200', width:'200', interval:'1000'," +
                                                " paths: [ ['yo',[13.39,52.50,13.43,52.54]], " +
                                                        "['yo','ho',[13.39,52.50,13.41,52.52] ], " +
                                                        "['yo','ho','a',[13.391,52.50,13.401,52.51] ]," +
                                                        "['yo','ho','b',[13.392,52.50,13.402,52.51] ]," +
                                                        "['yo','ho','c',[13.393,52.50,13.403,52.51] ]," +
                                                        "['yo','ho','d',[13.394,52.50,13.404,52.51] ]," +
                                                        "['yo','ho','e',[13.395,52.50,13.405,52.51] ]," +
                                                        "['yo','ho','f',[13.396,52.50,13.406,52.51] ]," +
                                                        "['yo','ho','g',[13.397,52.50,13.407,52.51] ]," +
                                                        "['yo','ho','h',[13.398,52.50,13.408,52.51] ]," +
                                                        "['yo','ho','i',[13.399,52.50,13.409,52.51] ]," +
                                                        "['yo','ho','j',[13.3991,52.50,13.4091,52.51] ]," +
                                                        "['yo','ho','k',[13.3992,52.50,13.4092,52.51] ]," +
                                                        "['yo','ho','l',[13.3993,52.50,13.4093,52.51] ] ]," +
                                                        "page:[3] }",
                                                //"font:'sans-serif'," +
                                                //"font_size:'20px'," +
                                                //"text_color:'#FFFF00'," +
                                                //"background_color: '#00FFFF' "
				  "data": function() {
					return "wait";
						     }
				},
			'tree2':
                        	{ "init": 
					"{ name: 'tree2', type:'tree', x:'240', y:'350', height:'200', width:'200', interval:'1000'," +
                                                " paths: [ ['yo',[0.0,1.0,0.0,1.0]], " +
                                                        "['yo','ho',[0.0,0.5,0.0,0.5] ], " +
                                                        "['yo','ho','a',[0.0,0.25,0.0,0.25] ]," +
                                                        "['yo','ho','b',[0.1,0.35,0.1,0.35] ]," +
                                                        "['yo','ho','c',[0.2,0.45,0.2,0.45] ]," +
                                                        "['yo','ho','d',[0.3,0.55,0.3,0.55] ] ]," +
                                                        "page:[3] }",
                                                //"font:'sans-serif'," +
                                                //"font_size:'20px'," +
                                                //"text_color:'#FFFF00'," +
                                                //"background_color: '#00FFFF' }"
				  "data": function() {
					return "wait";
						     }
				}
			};

var _trees_test_script = [ 
	[ "init", 'tree1', _trees_str['tree1']['init'] ],
	[ "init", 'tree2', _trees_str['tree2']['init'] ],
	[ "data", 'tree1', _trees_str['tree1']['data'] ],
	[ "data", 'tree2', _trees_str['tree2']['data'] ],
	[ "data", 'tree1', function() { return "done"; } ],
	[ "data", 'tree2', function() { return "done"; } ]
			];

var _trees_test_idx = 0;

function _trees_peek_next_test()
{
	if ( _trees_test_idx == _trees_test_script.length )
		return false;
	else
		return _trees_test_script[ _trees_test_idx ];
}

function _trees_get_next_test()
{
	if ( _trees_test_idx == _trees_test_script.length )
		return false;
	else
	{
		var val = _trees_test_script[ _trees_test_idx ];
		_trees_test_idx++;
		return val;
	}	
}

var _trees_test = {
	'peek' : _trees_peek_next_test,
	'next' : _trees_get_next_test
		   };

function trees_script_init( )
{
	SOURCES[ SOURCES.length ] = _trees_test;
}
