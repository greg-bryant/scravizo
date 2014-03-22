
var _TABLESJS = null;

var table_row=0;

var _tables_str = {
			'table1':
				{ "init":
					"{ name: 'table1', type:'table', title:'default title', x:'270', y:'100', height:'300', width:'400'," +
                                                " interval:'1000'," +
                                                " font: 'sans-serif', font_size: '10px', text_color: '#FFFFFF', background_color: '#808080', " +
                                                " editable:'no', plain_alternated_checkered:'plain', " +
                                                " columns:[{header:'blah', type:'string'},{header:'blah1', type:'dollars'},{header:'blah2', type:'real'}," +
                                                " {header:'blah3', type:'integer'},{header:'blah', type:'date'}]," +
                                                "z: 1, page:[4] }",
				  "data": function() {
					var v1 = Math.random();
                                        var v2 = Math.random();
                                        var v3 = Math.random();
                                        var v4 = Math.random();
                                        var data = "[ {'row':'" + table_row + "','column':'0', value:'" + v1 + "'}, " +
                                        " {'row':'" + table_row + "','column':'1', value:'" + v2 + "'}, " +
                                        " {'row':'" + table_row + "','column':'2', value:'" + v3 + "'}, " +
                                        " {'row':'" + table_row + "','column':'3', value:'" + v4 + "'} ]";
					table_row++;
					return data;
						     }
				}
			};

var _tables_test_script = [ 
	[ "init", 'table1', _tables_str['table1']['init'] ],

	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],
	[ "data", 'table1', _tables_str['table1']['data'] ],

	[ "data", 'table1', function() { return "done"; } ],
			];

var _tables_test_idx = 0;

function _tables_peek_next_test()
{
	if ( _tables_test_idx == _tables_test_script.length )
		return false;
	else
		return _tables_test_script[ _tables_test_idx ];
}

function _tables_get_next_test()
{
	if ( _tables_test_idx == _tables_test_script.length )
		return false;
	else
	{
		var val = _tables_test_script[ _tables_test_idx ];
		_tables_test_idx++;
		return val;
	}	
}

var _tables_test = {
	'peek' : _tables_peek_next_test,
	'next' : _tables_get_next_test
		   };

function tables_script_init( )
{
	SOURCES[ SOURCES.length ] = _tables_test;
}
