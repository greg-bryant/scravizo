
var _CONTROLSJS = null;

var _controls_str = {
			'control1':
				{ "init":
                         		"{ name: 'control1', type:'control', title:'Objects', x:'20', " +
                                                "y:'20', height:'200', width:'200', " +
                                                "buttons: [" +
                                                "{name:'charts', target_page:1}," +
                                                "{name:'lists', target_page:2}," +
                                                "{name:'maps with trees', target_page:3}," +
                                                "{name:'image equirectangular map', target_page:7}," +
                                                "{name:'tables', target_page:4}," +
                                                "{name:'controls', target_page:5}]," +
				                "button_width:'150px'," +
                                                "logo:'on'," +
                                                "z: 1, page:'all'}"
				},
			'control2':
                        	{ "init": "{ name: 'control2', type:'control', title:'the default title', x:'250', " +
                                                "y:'50', height:'200', width:'200', " +
                                                "buttons:[{name:'run'},{name:'stop'}," +
                                                "{name:'pause',toggle_name:'resume'}," +
                                                "{name:'reset'},{name:'restart'},{name:'refresh'},{name:'delete'}]," +
                                                "drop_down:{name:'dd1','items':[{item:'aa',selected:'yes'},{item:'b'}]}," +
                                                "text_field: {name:'tf1', label:'submit', default:'a default'}," +
                                                "radio_buttons:{name:'radio1','items':[{item:'a',selected:'yes'},{item:'b'}]}," +
                                                "logo:'off'," +
                                                "z: 1, page:[5]}"
				},
                        'control3':
                                { "init": "{ name: 'control3', type:'control', title:'the default title', x:'450', " +
                                                "y:'350', height:'200', width:'200', " +
                                                "text_field: {name:'tf2', label:'submit', default:'a control default'}," +
                                                "logo:'off'," +
                                                "z: 1, page:[5]}"
                                }
			};

var _controls_test_script = [ 
	[ "init", 'control1', _controls_str['control1']['init'] ],
	[ "init", 'control2', _controls_str['control2']['init'] ],
	[ "init", 'control3', _controls_str['control3']['init'] ]
			];

var _controls_test_idx = 0;

function _controls_peek_next_test()
{
	if ( _controls_test_idx == _controls_test_script.length )
		return false;
	else
		return _controls_test_script[ _controls_test_idx ];
}

function _controls_get_next_test()
{
	if ( _controls_test_idx == _controls_test_script.length )
		return false;
	else
	{
		var val = _controls_test_script[ _controls_test_idx ];
		_controls_test_idx++;
		return val;
	}	
}

var _controls_test = {
	'peek' : _controls_peek_next_test,
	'next' : _controls_get_next_test
		   };

function controls_script_init( )
{
	SOURCES[ SOURCES.length ] = _controls_test;
}
