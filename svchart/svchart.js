//
//	Config parameters for this library...
//



//
//	Constructor...
//
function SVChart( params )
{
	//	TODO: validate params is a dct...

	//	Iterate param dictionary and process each...
	var nparms = 0;
	for (var key in params)
	{
		this[key] = params[key]

		nparms++;
	}

	if ( nparms==0 )
	{
		return null;
	}

	//
	//	Initialize private members...
	//

	//	get container div...
	var divname = this['div_chart'];

	//	get title...
	var title = this['title'];

	//	eventually this should be parmed...
	var subtitle = '';

	//	eventually this should be parmed...
	var y_axis_label = '';

	//	subtype...
	var subtype = this['subtype'];

	//	get graph type...
	var graph_type = "line";
	if (this["points_or_lines_or_area"]=="point_with_line") graph_type = "scatter";
	else if (this["points_or_lines_or_area"]=="points") graph_type = "scatter";
	else if (this["points_or_lines_or_area"]=="area") graph_type = "area";
	this['graph_type'] = graph_type;

	//	create init series from num_series parm...
	var series_name = this['series_name'];
	var init_series = [];
	if (series_name!=null)
	{
		var ns = series_name.length;
		for (var i=0;i<ns;i++) init_series[i] = {name: series_name[i], data:[], type:graph_type};
	}

	//	pstacking...
	var pstacking = null;
	if (this['stacking']=="yes")
		pstacking = "normal";

	//	direction...
	var direction = this['direction'];

	//	categories...
	var categories = this['categories'];

	//	xtype...
	var xtype = this['x_type'];

	//	ytype...
	var y_type = "linear";
	if ('y_type' in this)
	        y_type = this['y_type'];

	// bar_labels
	var bar_labels = true;
	if ('bar_labels' in this)
	        bar_labels = false;

	//	yrange...
	var y_range =  this['y_range'];

	//	animation...
	var animation = this['animation']; 
	if (animation=='no')
		this['animation'] = false;
	else
		this['animation'] = true; // the default

	//	x label format for datetime...
	var x_dt_fmt= this['x_datetime_format'];

	// greg
	//	y label format for datetime...
	var y_dt_fmt= this['y_datetime_format'];

	//	initialize point_with_line counter...
	this.plc = 1;

	//	track render paths...
	this.renders = [];

	//	pie first time...
	this.pie_data_label_positions = [];
	this.pie_data_label_color = [];

	//	create the chart...
	if (subtype == 'graph')
	{
	    this._creategraph( divname, graph_type, title, subtitle, y_axis_label, pstacking, init_series, direction, xtype, y_range, y_type, x_dt_fmt );
	}
	else if ( subtype =='pie' )
	{
		this._createpie( divname, graph_type, title, subtitle, y_axis_label, pstacking );
	}	
	else if ( subtype =='bar' )
	{
	    this._createbar( divname, title, subtitle, categories, direction, y_range, y_type, pstacking, bar_labels );
	}	
	else
	{
		var cb_error = this['cb_error'];
        	var cb_obj = this['cb_obj'];

		if (cb_error!=null)
			cb_error( cb_obj, 'svgraph: invalid subtype');	
		else
			console.log('svgraph: invalid subtype');
	}
}

SVChart.prototype._createbar = function( divname, title, subtitle, categories, direction, y_range, y_type, pstacking, bar_labels )
{
	var tp = 'bar';
	if ( direction=="vertical" ) tp = 'column';

	//      create init series from num_series parm...
        var series_name = this['series_name'];
	var categories = this['categories'];
	var series = [];

	//	xaxis also depends on categories, so init here...
	var xAxis =  {
              title: {
	              text: null
		     }
		};

	// greg
	// I put in ALL lines with a reference to yaxis_t
	// just remove those lines
	//	determine the yaxis type for highcharts...
	var yaxis_t = "linear";
	 if ( y_type == "datetime" )
		yaxis_t = "datetime";


	//      default yaxis...
        var yAxis=  {
	     type: yaxis_t,
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            };
        if ( y_range != null )
        {
                var minRange = Number(y_range[1]);
                var min = Number(y_range[0]);
                var max = Number(y_range[1]);

                yAxis =  {
		        type: yaxis_t,
                        min: 0,
                        title: {
                                text: '',
                                align: 'high'
                        },
                        labels: {
                                overflow: 'justify'
                        },
                        minRange: minRange,
                        min: min,
                        max: max,
                        endOnTick: false
                };
        }

        //      get animation...
        var animation = this['animation'];

	if (categories!=null)
	{
        	var ns = series_name.length;
		var cs = categories.length;

		var series = [];

		plotOptions =  {
                	bar: {
                    		dataLabels: {
                        		enabled: bar_labels
                    			}
				}
			};

		if ( pstacking != null )
		{
			plotOptions['column'] = { 
					'stacking':'normal',
					dataLabels: { enabled: bar_labels } 
				};
		}

        	for (var i=0;i<ns;i++) 
		{
			var data = [];
			for (var j=0;j<cs;j++)
			{
				data[j] = 2.0;
			}
			var item = {name: series_name[i], data: data};
        		series[i] = item;
		}

		xAxis = {
                	categories: categories, 
                	title: {
                    		text: null
                	}
		};

		        this.chart = new Highcharts.Chart({
            chart: {
                renderTo: divname,
                type: tp,
                animation: animation
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: xAxis,
            yAxis: yAxis,
            legend: {
                enabled: false
                    },

            exporting: {
                enabled: false
                    },
            credits: { enabled: false },

	    plotOptions: plotOptions,
	/*
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
	*/

            series: series
        });
	}
	else // its the point_with_line...
	{
/*
		tp = 'columnrange';

		var item = {name: series_name[0], data: [ [ 198797197970,0, 12.4], [ 198797198980,0, 10.4] ] };
                series[0] = item;
		
		var data = [ [ 198797197970,0, 12.4], [ 198797198980,0, 10.4] ];

		this.chart = new Highcharts.StockChart({
    	
		chart: {
		        renderTo: 'container',
		        type: 'columnrange'
		    },
		    
		    rangeSelector: {
		    	selected: 2
		    },
		    
		    title: {
		        text: 'Temperature variation by day'
		    },
		
		    tooltip: {
		        valueSuffix: '°C'
		    },
		    
		    series: [{
		        name: 'Temperatures',
		        data: data
		    }]
		
		});
		*/
	}

}

SVChart.prototype._createpie = function( divname, graph_type, title, subtitle, y_axis_label, pstacking )
{

	//Highcharts.setOptions({
     	//colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4']
        //});

        //      create init series from num_series parm...
	var series_name = this['series_name'];
        var ns = series_name.length;
        var init_series = [];
        for (var i=0;i<ns;i++) init_series[i] = {name: series_name[i], y:0.0};
	var series = [ { type:'pie', name:title, 
				colors: ['#F64A16', '#0ECDFD', '#FF0000' ],
				data: init_series } ];

        //      get animation...
        var animation = this['animation'];

	this.chart = new Highcharts.Chart({
            chart: {
                renderTo: divname,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
		animation: false //animation
            },
            title: {
                text: title
            },
            legend: {
                enabled: false
                    },
            exporting: {
                enabled: false
                    },
	    credits: { enabled: false },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        },
			distance:0
                    }
                }
            },
	    series: series
/*
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]
            }]
*/
        });
}

function _ondataclick( inst, data )
{
	if ( data.y > inst.threshold )
	{
		var cb = inst['threshclick'];	
		var cbdata = inst['threshdata'];
		var name = inst['name'];

		if ( cb != null )
		{
			cb( cbdata, name, data.series.name, data.x, data.y );
		}	
	}
}

SVChart.prototype._creategraph = function( divname, graph_type, title, 
	subtitle, y_axis_label, 
	pstacking, init_series, 
	direction, x_range, 
	y_range,y_type,
	x_dt_fmt )
{
	//	determine orientation for highcharts...
	var inverted = false;
	if ( direction == "vertical" ) inverted = true;

	//	'this' is overloaded depending on context, so we need to be careful...
	var inst = this;

	//	margin bottom default...
	var mg_bottom = 20;
	var mg_right = 10;
	
	//	determine the xaxis type for highcharts...
	var xaxis_t = "linear";
	if ( x_range == "datetime" )
		xaxis_t = "datetime";
	var xAxis =  {
                type: xaxis_t,
                labels: {
                        style: {
                                color: '#FFFFFF'
                                }
                        }
                };
	if ( (x_range =="datetime") && ( x_dt_fmt == "full" ) )
	{
        	xAxis =  {
                	type: xaxis_t,
			tickPixelInterval: 200,
                	labels: {
                        	style: {
                                	color: '#FFFFFF'
                                	},
				align:'left',
				rotation:20,
				overflow:'justify',
				formatter: function() {
                			return Highcharts.dateFormat('%Y-%m-%e %H-%M-%S', this.value);
            				}
				}
                	};
		mg_bottom = 60;
		mg_right = 60;
	}

	//	get animation...
	var animation = this['animation'];

	// greg
	// I put in ALL lines with a reference to yaxis_t
	// just remove those lines
	//	determine the yaxis type for highcharts...
	var yaxis_t = "linear";
	if ( y_type == "datetime" )
		yaxis_t = "datetime";

	//	determine yaxis...
	var yAxis =  {
	     type: yaxis_t, 
                title: {
                    text: y_axis_label
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                gridLineColor: '#FFFFFF',
                labels: {
                        style: {
                                color: '#FFFFFF'
                                }
                        }
                };
	if ( y_range != null )
	{
	  var minRange = Number(y_range[1]);
	  var min = Number(y_range[0]);
	  var max = Number(y_range[1]);
	  yAxis =  {
	        type: yaxis_t,
                title: {
                    text: y_axis_label
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                gridLineColor: '#FFFFFF',
                labels: {
                        style: {
                                color: '#FFFFFF'
                                }
                        },
		minRange: minRange,
		min: min,
		max: max,
		endOnTick: false
                };
	}


	//	initialize highchart...
	this.chart = new Highcharts.Chart(
	{
            chart: {
                renderTo: divname,
                //type: graph_type,
                marginRight: mg_right,
                marginBottom:  mg_bottom,	
		backgroundColor: '#808080',
		inverted: inverted,
		animation: animation
            },
            title: {
                text: title,
                x: 0, //center
		style: {
			color: '#FFFFFF'
			}

            },
            subtitle: {
                text: subtitle,
                x: 0
            },
	    xAxis: xAxis,
            yAxis: yAxis,
	    legend: { 
		enabled: false
		    },
	    exporting: {
		enabled: false
		    },
	    credits: { enabled: false },
            series: init_series,
	    plotOptions: {
                             area: {
                                                       stacking: pstacking,
                                                       lineColor: '#ffffff',
                                                       lineWidth: 1,
                                                       marker: {
                                                               lineWidth: 1,
                                                               lineColor: '#ffffff'
                                                       }
                                               },
			      series: {
				point: {
                        		events: {
                            			'click': function() {
							_ondataclick(inst, this);
                            					}
                        			}
                    			}
                                       }
			}
        });

	//	possibly, add the regression line...
	if ( this['line'] != null )
	{
		var data = {
                	type: 'line',
                	name: 'Regression Line',
                	data: this['line'], //[[0, 1.11], [5, 4.51]],
                	marker: {
                    		enabled: false
                	},
                	states: {
                    	hover: {
                        	lineWidth: 0
                    		}
                	},
                	enableMouseTracking: false
            	};

		this.chart.addSeries( data, false, false );

		//	store a ref to the series...
		var num_series = this.chart.series.length;
		this['line_series'] = this.chart.series[num_series-1];
	}


}

SVChart.prototype.ShowPage = function(pg)
{
        var ctlpage = this.page;
        if (ctlpage==null) ctlpage = 'all';

        if ( ctlpage=='all')
        {
                this.parent.style.display = "inline";
        }
        else // assume its a list...
        {
                var this_page = parseInt(pg);

                var pages_to_show = eval( ctlpage );

                for ( var ii=0; ii < pages_to_show.length;ii++ )
                {
                        var show_page = pages_to_show[ii];
                        if ( show_page == this_page )
                        {
                                this.parent.style.display = "inline";
                                return;
                        }
                }

                //      got here, don't display...
                this.parent.style.display = "none";
        }
}

SVChart.prototype.Delete = function()
{
	this.parent.outerHTML = "";
}

SVChart.prototype.Reset = function()
{
	for ( var i=0;i < this.chart.series.length; i++)
	{
		var series = this.chart.series[i];
		series.setData([]);
	}
}

SVChart.prototype.ChangeLine = function(data, clear)
{
	var line = data['line']

	this['line_series'].setData( line, true )

}

SVChart.prototype.AddPoints = function(data, clear)
{
	var subtype = this['subtype'];
	var cb_error = this['cb_error'];
	var cb_obj = this['cb_obj'];

        //      get animation...
        var animation = this['animation'];

	if ( subtype == "graph" )
	{
		//	datetime?...
		var dt = false;
		if ( this['x_type'] == 'datetime' )
			dt = true;

		//	iterate array...
		for ( var i=0; i< data.length;i++ )
		{
			//	get i'th data item...
			var item = data[i];
			var sidx = item.series;

			//	check data point is in bounds...
			if ( sidx >= this.chart.series.length )
			{
				if (cb_error!=null)
					cb_error( cb_obj, 'svchart: error, invalid series index->' + sidx );	
				else
					console.log( 'svchart: error, invalid series index->' + sidx );	
				continue;
			}
		
			if ( dt ) // datetime type requires special handling...
			{	
				var xpt = item.x;
				var ypt = item.y;

				//	add to series...	
				var series = this.chart.series[sidx];
				var ypoint = Number(ypt);
				var xpoint = Number(xpt);
				series.addPoint( [ xpoint, ypoint ], false, false, animation );
			}
			else
			{
				var pt = item.y;
				
				//	add to series...	
				var series = this.chart.series[sidx];
				var point = Number(pt);
				series.addPoint( point, false, false, animation );
			}	

		}

		//	get some x-axis behaviors...
		var chart_start = this['chart_start'];
		var shift = this['shift'];

		//	Possibly adjust x axis (start,end,range)...
		if ( chart_start == "left" )
		{

		//	possibly lock the x range to window points at the start...
		var window_points = this['window_points'];
		if ( window_points != null )
		{
			//	figure out where we are locking the x-range (at start, or shift )...
			var w = Number(window_points);
			var extremes = this.chart.xAxis[0].getExtremes();
			var maxp = this.chart.series[0].data.length;

			if ( (shift == "yes" ) && ( extremes.dataMax - w > 0 ) )
			{
				this.chart.xAxis[0].setExtremes( extremes.dataMax-w, extremes.dataMax, false, animation );
			}
			else if ( maxp < w ) // lock the x-range at the beginning...
			{
				this.chart.xAxis[0].setExtremes( extremes.dataMin, extremes.dataMin + w, false, animation ) ; //true );
			}
			else // let it grow...
			{
				this.chart.xAxis[0].setExtremes( extremes.dataMin, extremes.dataMin + maxp, false, animation); //true );
			}
		}
	
		}
		else // fill
		{
                
		var window_points = this['window_points'];
		var w = Number(window_points);
                var extremes = this.chart.xAxis[0].getExtremes();
		
		if ( extremes.dataMin == null )
		{
			this.chart.redraw();
                	extremes = this.chart.xAxis[0].getExtremes();
		}

		if (w==9)
		{
			w=w;
		}

		//	deal with funky initial x range with just first integral datapoint
		//	but only do it to point_with_line to work around the clipping issue...
		if ( (extremes.min == -0.01 ) && (this["points_or_lines_or_area"]=="point_with_line") )
		{
			//  adjust for integral x units...
                        var mi = -0.5;
                        var ma = 0.5;
                	this.chart.xAxis[0].setExtremes( mi, ma, false, animation );
		
		}
		//	shift the x-window ? ...	
		else if ( (w!=null) && (shift == "yes" ))
                {
			if ( extremes.dataMax-w>=0)
			{
				//  adjust for integral x units...
                        	var mi = extremes.dataMax-(w-1)-0.5;
                        	var ma = extremes.dataMax+0.5;
                		this.chart.xAxis[0].setExtremes( mi, ma, false, animation );
			}
			else
			{
				                        var mi = extremes.dataMin-0.5;
                        var ma = extremes.dataMax+0.5;
                        this.chart.xAxis[0].setExtremes( mi, ma, false, animation );
			}
                }
		else // just let the x-axis grow...
		{
		}
	
		}


		//	finally draw the updates...
		this.chart.redraw();

		//	deal with point_with_line...
		if (this["points_or_lines_or_area"]=="point_with_line")
		{

			// clear any previous renders...
			for ( var k=0;k< this.renders.length;k ++ )
                        {
				var rid = this.renders[k];
				var elid = "#" + rid;
				var el = $(elid);
				el.remove() ;
			}		
			this.renders = [];	

		
			for ( var k=0;k< this.chart.series[0].data.length;k ++ )
			{
				var point = this.chart.series[0].data[k];
				console.log(point);

				var gr = this.chart.series[0].data[k];
				var color = gr.graphic.fill;
				if ( (color==null) || (color==undefined) )
					color = this.chart.options.colors[0];
				var width = gr.graphic.width;
				var added = gr.graphic.added;

				var chart = this.chart;
        			var xoffset = chart.series[0].xAxis.left;
        			var yoffset = chart.series[0].xAxis.top;
				var startX = chart.series[0].data[k].plotX + xoffset;
            			var startY = chart.series[0].data[k].plotY + yoffset;
            			var endX = chart.series[0].data[k].plotX + xoffset;
            			var endY = 120+yoffset;
            			
				if ( startX < xoffset  ) continue;

				/*
				var rid = "renderc-" + k;	
				var path = gr.graphic.d.split(" ");
				chart.renderer.path(path)
                    			.attr({ 'stroke-width': width, stroke: 'red', id:rid, zIndex:2 })
                    			.add();
				this.renders.push( rid );
				*/
	
				var rid = "renderl-" + k;	
				chart.renderer.path(['M', startX, startY, 'L', endX, endY])
                    			.attr({ 'stroke-width': width, stroke: color, id:rid, zIndex:2 })
                    			.add();
				this.renders.push( rid );
			}
		}

	} // subtype==graph

	else if (subtype =="pie" )
	{
	        //      create init series from num_series parm...
        	var series_name = this['series_name'];
        	var ns = series_name.length;
        	var new_data = [];
        	for (var i=0;i<ns;i++) 
			new_data[i] = {name: data[i].series, y:Math.round( Number(data[i].y) )};
			//new_data[i] = Math.round( Number(data[i].y) );
		
		this.chart.series[0].setData( new_data, true );

		if ( this.pie_data_label_positions.length == 0 )
		{	
			this.chart.series[0].setData( new_data, true );

			//	get first x,y positions of labels...
			for (var m=0;m<this.chart.series[0].data.length;m++)
			{
				var point = this.chart.series[0].data[m];
				var x = point.dataLabel.x;
				var y = point.dataLabel.y;
				this.pie_data_label_positions[m] = [ x,y ];
				this.pie_data_label_color[m] = point.color;
    			}
		}
		else
		{
			//this.chart.series[0].setData( new_data, true );

			for (var m=0;m<this.chart.series[0].data.length;m++)
                        {
                                var point = this.chart.series[0].data[m];
				var new_y = Math.round( Number(data[m].y) );
				
				var pos = this.pie_data_label_positions[m];
                                var x = pos[0];
                                var y = pos[1];
                                point.dataLabel.attr({x:x,y:y,distance:0});
				var color = this.pie_data_label_color[m];

				var redraw = false;
                                if ( m== ( this.chart.series[0].length-1 ) ) redraw = true;
				point.update( {y:new_y, color:color }, redraw, false );
			}
		
			//this.chart.redraw();	

		}
	}
	else if (subtype =="bar" )
	{
			//      create init series from num_series parm...
        		var series_name = this['series_name'];
        		var ns = series_name.length;
        		for (var i=0;i<ns;i++)
			{
				var new_data = data[i].value; //{name: data[i].name, data:data[i].value};
				var new_color = data[i].color;
				// this.chart.series[i].setData( new_data, true );
				var ndl = new_data.length;
				var new_struct = new Array();
				for (var j=0;j < ndl;j++) {
				    new_struct.push( { color: new_color, y: new_data[j] } );  
				}

				// this works for three series:
				// this.chart.series[i].setData( [{color: new_color,y:new_data[0]},{color:new_color,y:new_data[1]},{color:new_color,y:new_data[2]}], true );

				this.chart.series[i].setData( new_struct, true );
			}
	}

}


