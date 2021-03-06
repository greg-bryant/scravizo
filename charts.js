
var _CHARTSJS = null;

function R()
{
        return Math.round(Math.random()*10);
}

var chart3_rr = 0;
var dateinc = 0;
var chart8 = 0;

var _charts_str = 
		{
			'chart1': {
					'init':"{ name: 'chart1', type:'chart', title:'Graph-horizontal', " +
						"subtype:'graph'," +
                                                "window_points:'10', " +
                                                "x:'250', y:'20', height:'200', width:'200', interval:'1000', " +
                                                "points_or_lines_or_area:'area', " +
                                                "series_name:['one','two'], chart_start:'fill', shift:'no'," +
                                                "stacking:'no'," +
						"direction:'horizontal'," +
                                                "page:[1]," + 
						"threshold:'13.0', animation:'no', y_range: [ 0, 41 ] }",
					'data': function() {
							return "[ {series:0,y:'12.4'},{series:0,y:'45.5'},{series:0,y:'12.4'}," + 
								 "{series:1,y:'12.0'},{series:1,y:'15.0'} ]";
							}
				  },
			'chart2': {
					'init':"{ name: 'chart2', type:'chart', title:'Graph-vertical', " +
						"subtype:'graph'," +
                                                "window_points:'9', " +
                                                "x:'480', y:'20', height:'200', width:'200', interval:'1000', " +
                                                "points_or_lines_or_area:'area', " +
                                                "series_name:['one','two'], chart_start:'fill', shift:'no'," +
                                                "stacking:'no'," +
						"direction:'vertical'," +
                                                "page:[1] }",
					'data':function() {
						return "[ {series:0,y:'12.4'}, {series:0,y:'13.5'},{series:1,y:'12.0'} ]";
							}
				},
			'chart3': {
					'init':"{ name: 'chart3', type:'chart', title:'pie', " +
                                                "subtype:'pie'," +
                                                "x:'250', y:'300', height:'200', width:'400', interval:'1000', " +
                                                "series_name:['chrome','firefox','ie' ]," +
						"page:[1], animation:'yes' }",
					'data': function() {
						if (chart3_rr==0) {
                                        		chart3_rr=1; return "[ {series:'chrome',y:'20'}, {series:'firefox',y:'30'}, {series:'ie',y:'50'}  ]";
                                			}
                                		else if (chart3_rr==1) { 
							chart3_rr=2; return "[ {series:'chrome',y:'21'}, {series:'firefox',y:'31'}, {series:'ie',y:'48'}  ]";
                                			}
                                		else if (chart3_rr==2) {
                                        		chart3_rr=0; return "[ {series:'chrome',y:'22'}, {series:'firefox',y:'32'}, {series:'ie',y:'46'}  ]";
                                			}
						} 
				},
			'chart4':  {
					'init':"{ name: 'chart4', type:'chart', title:'bar-vertical', " +
                                                "subtype:'bar'," +
                                                "x:'680', y:'300', height:'200', width:'400', interval:'1000', " +
                                                "categories:['aaa','bbb','ccc','ddd','eee']," +	
                                                "series_name:['chrome','ie','firefox' ]," +
						"direction:'vertical'," +
						"page:[1]," +
                                                "y_range: [ 0, 5 ] }",
					'data': function() { 
						return  "[ {name:'chrome'," +
                                                	"value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                        		"  {name:'ie'," +
                                                	"value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                        		"  {name:'firefox'," +
                                                	"value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}]";
							}
				   },
			'chart5':  {
                        		'init':"{ name: 'chart5', type:'chart', title:'bar-horizontal', " +
                                                "subtype:'bar'," +
                                                "x:'250', y:'550', height:'200', width:'400', interval:'1000', " +
                                                "categories:['aaa','bbb','ccc','ddd','eee']," +
                                                "series_name:['chrome','ie','firefox' ]," +
                                                "direction:'horizontal'," +
                                                "page:[1] }",
					'data': function() { return "done"; }
				   },
                        'chart6': {
                                        'init':"{ name: 'chart6', type:'chart', title:'Graph-horizontal-datetime', " +
                                                "subtype:'graph'," +
                                                "window_points:'10', " +
                                                "x:'710', y:'20', height:'200', width:'350', interval:'1000', " +
                                                "points_or_lines_or_area:'lines', " +
                                                "series_name:['one','two'], chart_start:'fill', shift:'no'," +
                                                "stacking:'no'," +
                                                "direction:'horizontal'," +
                                                "page:[1]," +
                                                "threshold:'13.0'," + 
						"x_type:'datetime' }",
                                        'data': function() {
							return "[ {series:0,x:  '198797197970',y:'12.4'}," +
								 "  {series:0,x:'1987971922270',y:'15.4'}," +
								 "  {series:0,x:'2987972922270',y:'65.4'}," +
								 "  {series:1,x:'198797197970',y:'9.4'}," +
								 "  {series:1,x:'1987971922270',y:'22.0'}," +
								 "  {series:1,x:'2987971982270',y:'32.0'}  ]";
                                                        }
                                  },
			'chart7': {
					'init':
						"{ name: 'chart7', type:'chart', title:'bar-vertical', " +
                                                "subtype:'bar'," +
                                                "x:'200', y:'850', height:'200', width:'400', interval:'1000', " +
                                                "categories:['one','two','three','four']," +
                                                "series_name:['value1','value2' ]," +
                                                "direction:'vertical'," +
                                                "page:[1] }",
					'data': function() {
						//return "wait";
						return  "[ {name:'value1'," +
                                                	"value:[" + R() + "," + R() + ","+ R() + ","+ R() + "] }," +
                                        		" {name:'value2'," +
                                                	"value:[" + R() + "," + R() + ","+ R() + ","+ R() + "] } ]";	
						}
				},
			'chart8': { 
					'init':"{ name: 'chart8', type:'chart', title:'Points With Line', " +
						"series_name:['items']," +
                                                "subtype:'graph'," +
                                                "window_points:'5', " +
                                                "x:'250', y:'550', height:'200', width:'200', interval:'1000', " +
                                                "points_or_lines_or_area:'point_with_line', " +
                                                //"points_or_lines_or_area:'points', " +
                                                "chart_start:'fill', shift:'yes'," +
                                                "stacking:'no'," +
                                                "page:[1]," +
                                                "animation:'no' }",
                                        'data': function() {
						if ( chart8>7 ) return "wait";
						chart8++;
						var base = 198797197970;
						var dt = base  + dateinc*10000000000;
						dateinc++;
						return "[ {series:0,y:'" + R() +" '} ] ";
                                                        }
				},
			'chart9': {
					'init':"{ name: 'chart9', type:'chart', title:'Points With Regression Line', " +
                                                "subtype:'graph'," +
                                                "window_points:'10', " +
                                                "x:'500', y:'550', height:'200', width:'350', interval:'1000', " +
                                                "points_or_lines_or_area:'points', " +
                                                "series_name:['one'], chart_start:'fill', shift:'no'," +
                                                "stacking:'no'," +
                                                "direction:'horizontal'," +
                                                "page:[1]," +
						"line:[[0, 1.11],[5, 4.51]] }",
                                        'data': function() {
                                                        return "[ " +
                                                                 "  {series:0,y:'1.0'}," +
                                                                 "  {series:0,y:'1.5'}," +
                                                                 "  {series:0,y:'2.8'}," +
                                                                 "  {series:0,y:'3.5'}," +
                                                                 "  {series:0,y:'3.9'}," +
                                                                 "  {series:0,y:'4.2'}  ]";
                                                        },
					'dataline2': function() {
							return "{ line:[[0, 1.11],[5, 9.5]] }" },
					'dataline3': function() {
							return "{ line:[[0, 1.11],[5, 12.5]] }" },
					'dataline4': function() {
							return "{ line:[[0, 1.11],[5, 14.5]] }" },
					'dataline5': function() {
							return "{ line:[[0, 1.11],[5, 17.5]] }" }

				},
	                  'chart10':  {
                                        'init':"{ name: 'chart10', type:'chart', title:'bar-vertical-stacking', " +
                                                "subtype:'bar'," +
                                                "x:'800', y:'850', height:'200', width:'400', interval:'1000', " +
                                                "categories:['aaa','bbb','ccc','ddd','eee']," +
                                                "series_name:['chrome','ie','firefox' ]," +
                                                "direction:'vertical'," +
						"stacking:'yes'," +
                                                "page:[1]}",
                                        'data': function() {
                                                return  "[ {name:'chrome'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                                        "  {name:'ie'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                                        "  {name:'firefox'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}]";
                                                        }
			      },
	                  'chart11':  {
                                        'init':"{ name: 'chart10', type:'chart', title:'bar-vertical-stacking-colors', " +
                                                "subtype:'bar'," +
                                                "x:'800', y:'1150', height:'200', width:'400', interval:'1000', " +
                                                "categories:['aaa','bbb','ccc','ddd','eee']," +
                                                "series_name:['chrome','ie','firefox' ]," +
					        "series_colors:['0xaaaaaa','0xffffff','0x000000']," +
					        "series_labels:['yes','no',yes']," +
					        // labels means the numbers drawn inside each box  
                                                "direction:'vertical'," +
						"stacking:'yes'," +
                                                "page:[1]}",
                                        'data': function() {
                                                return  "[ {name:'chrome'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                                        "  {name:'ie'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}," +
                                                        "  {name:'firefox'," +
                                                        "value:[" + R() + "," + R() + ","+ R() + ","+ R() + ","+ R() + "]}]";
                                                        }
                                   }


			};

var _charts_test_script = [ 
	[ "init", 'chart1', _charts_str['chart1']['init'] ],
	[ "init", 'chart2', _charts_str['chart2']['init'] ],
	[ "init", 'chart3', _charts_str['chart3']['init'] ],
	[ "init", 'chart4', _charts_str['chart4']['init'] ],
	[ "init", 'chart6', _charts_str['chart6']['init'] ],
	[ "init", 'chart7', _charts_str['chart7']['init'] ],
	[ "init", 'chart8', _charts_str['chart8']['init'] ],
	[ "init", 'chart9', _charts_str['chart9']['init'] ],
	[ "init", 'chart10', _charts_str['chart10']['init'] ],

	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart6', _charts_str['chart6']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	[ "data", 'chart9', _charts_str['chart9']['data'] ],
	[ "data", 'chart10', _charts_str['chart10']['data'] ],

	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	[ "data", 'chart9', _charts_str['chart9']['dataline2'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	[ "data", 'chart9', _charts_str['chart9']['dataline3'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	[ "data", 'chart9', _charts_str['chart9']['dataline4'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	[ "data", 'chart9', _charts_str['chart9']['dataline5'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],
	
	[ "data", 'chart1', _charts_str['chart1']['data'] ],
	[ "data", 'chart2', _charts_str['chart2']['data'] ],
	[ "data", 'chart3', _charts_str['chart3']['data'] ],
	[ "data", 'chart4', _charts_str['chart4']['data'] ],
	[ "data", 'chart7', _charts_str['chart7']['data'] ],
	[ "data", 'chart8', _charts_str['chart8']['data'] ],





	[ "data", 'chart1', function() 
			{ 
				return "done";
			}  
	],
	[ "data", 'chart2', function() { return "done";}  ],
	[ "data", 'chart3', function() { return "done";}  ],
	[ "data", 'chart4', function() { return "done";}  ],
	[ "data", 'chart6', function() { return "done";}  ],
	[ "data", 'chart7', function() 
		{ 
			return "done";
		}  
	],
	[ "data", 'chart8', function() { return "done";}  ],
	[ "data", 'chart9', function() { return "done";}  ]
			];

var _charts_test_idx = 0;

function _charts_peek_next_test()
{
	if ( _charts_test_idx == _charts_test_script.length )
		return false;
	else
		return _charts_test_script[ _charts_test_idx ];
}

function _charts_get_next_test()
{
	if ( _charts_test_idx == _charts_test_script.length )
		return false;
	else
	{
		var val = _charts_test_script[ _charts_test_idx ];
		_charts_test_idx++;
		return val;
	}	
}

var _charts_test = {
	'peek' : _charts_peek_next_test,
	'next' : _charts_get_next_test
		   };

function charts_script_init( )
{
	SOURCES[ SOURCES.length ] = _charts_test;
}
