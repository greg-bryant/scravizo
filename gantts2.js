
var _GANTTSJS = null;

var _gantts_str = {
			'gantt1':
				{ "init":
					"{ name: 'gantt1', type:'gantt', x:'250', y:'50', height:'240', width:'700', interval:'1000'," +
						"title: 'Gantt'," +
                                                "page:'6' }",
				  "data": function() {
					return "[{ " +
                                        	"name: 'Sprint 0.0'," +
                                        	"desc: 'Observation'," +
                                        		"values: [{" +
                                                		"from: '/Date(1320192000000)/'," +
                                                		"to: '/Date(1322401600000)/', " +
                                                		"label: 'Gathering'," +
                                                		"customClass: 'ganttBlue' " +
                                        			"}]" + 
                                        		"},{" +
                                                "name: 'Sprint 1'," +
                                                "desc: 'Decomposition'," +
                                                        "values: [{" +
                                                                "from: '/Date(1322611200000)/'," +
                                                                "to: '/Date(1323302400000)/', " +
                                                                "label: 'Scoping'," +
                                                                "customClass: 'ganttBlue' " +
                                                                "}]" +
                                                        "},{" +
						"name: 'Sprint 2'," +
                                                "desc: 'Reconstruction'," +
                                                        "values: [{" +
                                                                "from: '/Date(1323802400000)/'," +
                                                                "to: '/Date(1325685200000)/', " +
                                                                "label: 'Research'," +
                                                                "customClass: 'ganttGreen' " +
                                                                "}]" +
                                                        "},{" +
						"name: 'Sprint 3'," +
                                                "desc: 'Testing'," +
                                                        "values: [{" +
                                                                "from: '/Date(1325685200000)/'," +
                                                                "to: '/Date(1325695200000)/', " +
                                                                "label: 'Production'," +
                                                                "customClass: 'ganttRed' " +
                                                                "}]" +
                                                        "}]";
						}
				}
			};

var _gantts_test_script = [ 
	[ "init", 'gantt1', _gantts_str['gantt1']['init'] ],

	[ "data", 'gantt1', _gantts_str['gantt1']['data'] ],

	[ "data", 'gantt1', function() { return "done"; } ],
			];

var _gantts_test_idx = 0;

function _gantts_peek_next_test()
{
	if ( _gantts_test_idx == _gantts_test_script.length )
		return false;
	else
		return _gantts_test_script[ _gantts_test_idx ];
}

function _gantts_get_next_test()
{
	if ( _gantts_test_idx == _gantts_test_script.length )
		return false;
	else
	{
		var val = _gantts_test_script[ _gantts_test_idx ];
		_gantts_test_idx++;
		return val;
	}	
}

var _gantts_test = {
	'peek' : _gantts_peek_next_test,
	'next' : _gantts_get_next_test
		   };

function gantts_script_init( )
{
	SOURCES[ SOURCES.length ] = _gantts_test;
}
