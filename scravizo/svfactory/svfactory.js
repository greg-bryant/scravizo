//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVFactory( params )
{
	//	TODO: validate params is a dct...

	//	Iterate param dictionary and process each...
	var nparms = 0;
	for (var key in params)
	{
		this[key] = params[key]
		nparms++;
	}

	//
	//	Initialize private members...
	//

	// all the various object dcts...
	this.svobjs = {}; 

	// the primary admin object from which to get control info...
	this.svadmin = new SVAdmin( {
					'cb_admin': this._admin_timeout,
					'cb_obj': this,
					'cb_error': _cb_error 
				    } );

	// the primary comm object from which to dispatch commands...
        this.svcomm = new SVComm( {
					'url':this['url'],
					'cb_init': this._cb_init,
					'cb_obj':this,
                                        'cb_error': _cb_error,
					'cb_fake': this['cb_fake']
				  });

	// make sure main_init is sent next...
	this.next = false;

	// initialize control bindings map...
	this.bindings = {};

	// debug...
	this.dbg = false;

	// start page...
	this['curpage'] = 1;

	// preset error prefixes...
	this.errprefix = [ 'Error: ', 'Warning: ', 'Info: ' ];
}

//
//	_emit_error: The callback to emit errors and warnings...
//
SVFactory.prototype.log = function( lvl, report) //  lvl=1 (error), lvl=2 (warn), lvl=3 (info)
{
	try
	{
		//	get report level, default to errors only...
		var report_lvl = this['report_level'];
		if (report_lvl==null) report_lvl = 7;

		//	get report sink, default to console...
		var report_sink = this['report_sink'];
		if ( report_sink==null) report_sink = 1;  // 1=(console), 2=(webservice)

		//	are we reporting for this message ?
		var _bt = (report_lvl>>(lvl-1));
		var bt = _bt & 0x1;
		if (bt>0)
		{
			//	create the full message...
			var msg = this.errprefix[ lvl-1 ] + report;

			var _rs = ( report_sink & 0x1 );
			if (_rs)
				console.log( msg );

			var _rrs = ( report_sink & 0x2 );
			if (_rrs)
				this.svcomm.SendError( msg );		
		}
		else
		{
			// 	not reporting...
		}
	}
	catch (err)
	{
		console.log('svfactory: there was a library error trying to emit log message->' + err );
	}
}

//
//	_get_ctl: Get a control by name...
//
SVFactory.prototype._get_ctl = function( name )
{
        // get the component...
        var parms = this.svobjs[name];
        if ( parms == null ) return null;

	// get the ctl...
	var ctl = parms['ctl'];
	return ctl;
}


SVFactory.prototype._process_report_and_level = function( retv, obj )
{

	//      Is there an error level key?...
        var level = retv['level'];
        if ( level !=null )
             obj['report_level'] = Number(level);

        //      Is there a report sink key?...
        var report = retv['report'];
        if ( report != null )
             obj['report_sink'] = Number(report);
}

//
//	_admin_timeout: The callback for the Admin object...
//
SVFactory.prototype._admin_timeout = function( inst, obj )
{
	try
	{
		var data = obj.svcomm.SendAdminRequest();
		if ( data=="wait" ) return;
		else if (data=="done") 
		{
			inst.RemoveInterval();
			return;
		}

		//	eval the string...
		_data = null;
		eval("_data = " + data );
        	var retv = _clone( _data );

		//	process any report/level keys...
		obj._process_report_and_level( retv, obj );

        	// 	is there a component key?...
        	var comp_name = retv['component'];
		if ( comp_name != null )
		{
        	
			var action = retv['action'];

        		// get the component...
        		var comp = obj._get_ctl( comp_name )
        		if ( comp != null )
        		{
        	
			//	perform the action...
                	if ( action=="reset" )
                	{
				//	call object's reset...
                		comp.Reset();
                	}
			else if ( action=="delete" )
			{
				//	call object's delete...
				comp.Delete();

				// delete all internal references to this object...
				var iid = obj.svobjs[comp_name]['cb_ref'];
				if (iid!=null) window.clearInterval( iid );
				delete obj.svobjs[comp_name];
			}
		
			}
			else
			{
				obj.log( 1, 'Cannot find control by the name->' + comp );
			}

		}
	}
	catch (ex)
	{
		obj.log( 1, 'svadmin: error in _admin_timeout' + ex );
	}
}


//
//      _adjustdiv: The _adjustdiv function for modifying a div....
//
function _adjustdiv( obj, name )
{
	var div = document.getElementById( name );
        var x = obj.x;
        var y = obj.y;
        var width = obj.width;
        var height = obj.height;
        
	div.style.left = x;
        div.style.top = y;
        div.width = width;
        div.height = height;
	div.style.width = width;
	div.style.height = height;
	if (obj.font != null )
	{
		div.style.fontFamily = '"'+ obj.font + '"';
		div.style.fontSize = obj.font_size;
		div.style.color = obj.text_color;
	}
}


//
//	_listtimeout: The interval function for a list...
//
function _listtimeout( args )
{
	var inst = null;
	try
	{
		inst = args[0];
		var name = args[1];

        	// get the svlist object...
		var svlist = inst._get_ctl( name );
		if (svlist==null)
		{
			inst.log( 1, 'list object not found for name->' + name );
			return;
		}

        	// make comm call to get list items...
        	var items = inst.svcomm.SendListDataRequest( name );

		inst.log(3, 'svfactory: _listtimeout: got web service response->' + items );

		if ( items == "done" )
		{
			if ( inst.svobjs[name]['cb_ref']!=null) 
                        {
                                window.clearInterval( inst.svobjs[name]['cb_ref'] );
                                inst.svobjs[name]['cb_ref'] = null;
                        }
			return;
		}
		else if ( items == "wait" )
		{
			return;
		}
		else
		{
			inst.log(3, 'svfactory: _listtimeout: adding items->' + items );

			// get the scroll policy...
			var scroll_or_refresh = inst.svobjs[name]['scroll_or_refresh'];
			var b_refresh = false;
			if (scroll_or_refresh=="refresh") b_refresh = true;

			// add the items...
        		svlist.AddItems( items, b_refresh );
	
			return;
		}
	}
	catch (err)
        {
		if (inst!=null)
                	inst.log(1,'svfactory: An error in svfactory/_listtimeout' + err);
		else
                	console.log('svfactory: An error in svfactory/_listtimeout' + err);
        }

}

//
//	_maptimeout: The interval function for a map object...
//
function _maptimeout( args )
{
	var inst = null;
        try
        {
                inst = args[0];
                var name = args[1];

                // get the svmap object...
		var svmap = inst._get_ctl( name );
		if ( svmap==null )
		{
			inst.log( 1, 'Cannot find map object by name->' + name );
			return;
		}

		// make comm call to get map items...
                var items = inst.svcomm.SendMapDataRequest( name, 0 );

                inst.log(3, 'svfactory: _maptimeout: got web service response->' + items);

		if ( items == "done" )
		{
			var interval = inst.svobjs[name]['cb_ref'];
			clearInterval( interval );
		}
		else if ( items == "wait" )
		{
			return;
		}
		else
		{
			//	get the 'clear or accumulate' policy...
			var ctl = inst.svobjs[name]['ctl'];
			var clear = true;
			if (inst.svobjs[name]['clear_or_accumulate']!="clear") clear = false;

			ctl.AddMarkers( items, clear);
		}

        }
        catch (err)
        {
		if (inst!=null)
         		inst.log(1,'svfactory: An error in svfactory/_mapimeout' + err);
		else
         		console.log('svfactory: An error in svfactory/_mapimeout' + err);
        }

}

//
//	_treetimeout: The interval callback for a tree object.
//
function _treetimeout( args )
{
	var inst = null;
        try
        {
                inst = args[0];
                var name = args[1];

                // get the svtree object...
                svtree = inst._get_ctl(name);
                if ( svtree==null )
                {
                        inst.log( 1, 'Cannot find tree object by name->' + name );
                        return;
                }

                // make svcomm call to get tree items...
                var paths = inst.svcomm.SendTreeDataRequest( name, false );

		inst.log(3, 'svfactory: _treetimeout: got web service response->' + paths );

		if ( paths == "done" )
		{
			if ( inst.svobjs[name]['cb_ref']!=null)
                        {
                                window.clearInterval( inst.svobjs[name]['cb_ref'] );
                                inst.svobjs[name]['cb_ref'] = null;
                        }
			return;
		}
		else if ( paths == "wait" )
		{
			return;
		}
		else
		{
			inst.log( 3, 'svfactory: _treetimeout: adding new paths now...' );

			svtree.AddPaths( paths, true );
			return;
		}
        }
        catch (err)
        {
		if (inst!=null)
                	inst.log('svfactory: An error in svfactory/_treetimeout' + err);
		else
                	console.log('svfactory: An error in svfactory/_treetimeout' + err);
        }

}

//
//	_charttimeout: The interval function for a chart object...
//
function _charttimeout( args )
{
	var inst = null;
        try
        {
                inst = args[0];
                var name = args[1];

		if ( name == "chart6" )
		{
			name= name;
		}

                // get the svchart object...
                svchart = inst.svobjs[name]['ctl'];

                // make comm call to get chart items...
                var points_or_line = inst.svcomm.SendChartDataRequest( name, false );

		if (points_or_line==undefined)
		{
			inst.log(1, 'svfactory: _charttimeout: got invalid value from svcomm SendChartDataRequest' );
			return;	
		}

                inst.log(3, 'svfactory: _charttimeout: got web service response->' + points_or_line );

                if ( points_or_line == "done" )
                {
			inst.log(3, 'svfactory: _charttimeout: removing interval function');
			if ( inst.svobjs[name]['cb_ref']!=null) 
			{
				window.clearInterval( inst.svobjs[name]['cb_ref'] );
				inst.svobjs[name]['cb_ref'] = null;
			}
			return;
		}
		else if ( points_or_line == "wait" )
		{
			return;
		}
		else
		{
			//	Is it points or line?

			if ( Object.prototype.toString.call( points_or_line ) == "[object Array]" )
			{
                        	inst.log( 3, 'svfactory: _charttimeout: adding new points now...' );

                        	svchart.AddPoints( points_or_line, false );

				return;
			}
			else if ( Object.prototype.toString.call( points_or_line ) == "[object Object]" )
			{
                        	inst.log( 3, 'svfactory: _charttimeout: adjusting line...' );

				svchart.ChangeLine( points_or_line, true );

				return;
			}
			else
			{
                		inst.log(1,'svfactory: Unknown chart data type requested!');

				return;
			}
			
                }
        }
        catch (err)
        {
		if (inst!=null)
                	inst.log(1,'svfactory: An error in svfactory/_charttimeout' + err);
		else
                	console.log('svfactory: An error in svfactory/_charttimeout' + err);
        }

}

//
//      _create: The _create function for init...
//
SVFactory.prototype._create = function(inst, obj)
{
	inst.log(3, 'svfactory: _create->' + inst + ' ' + obj);

	//	check if we already have that name...
	var name = obj['name'];
	var ctl = this._get_ctl(name);
	if ( ctl!=null )
	{
		inst.log(1, 'An object by that name already exists->' + name );
		return;
	}


	if ( obj['type'] == 'page' )
	{
		inst.log(3, 'svfactory: create page...');

		var title = obj['title'];
		document.title = title;
		inst['curpage'] = obj['start'];	

                //      process any report/level keys...
                this._process_report_and_level( obj, this );

	}
	else if ( obj['type'] == 'list' )
	{
		inst.log(3, 'svfactory: create list...');

		return this._createlist( inst, obj );
	}
	else if ( obj['type'] == 'map' )
	{
		inst.log(3, 'svfactory: create map...');

		return this._createmap( inst, obj );
	}
	else if ( obj['type'] == 'tree' )
	{
		inst.log(3, 'svfactory: create tree...');

		return this._createtree( inst, obj );
	}
        else if ( obj['type'] == 'chart' )
        {
                inst.log(3, 'svfactory: create chart...');

                return this._createchart( inst, obj );
        }
        else if ( obj['type'] == 'control' )
        {
                inst.log(3, 'svfactory: create control...');

                return this._createcontrol( inst, obj );
        }
        else if ( obj['type'] == 'table' )
        {
                inst.log(3, 'svfactory: create table...');

                return this._createtable( inst, obj );
        }
        else if ( obj['type'] == 'gantt' )
        {
                inst.log(3, 'svfactory: create gantt...');

                return this._creategantt( inst, obj );
        }
	else
	{
		inst.log( 1, "svfactory: type not yet supported->" + obj['type'] );
		throw( "svfactory: type not yet supported->" + obj['type'] );
	}
}

//
//	_controlclick: callback for a control button...
//
function _controlclick(inst,name,title)
{
	inst.svcomm.SendActionEvent( 'button', name, title);
}

//
//	_controlselect: callback for a selection control...
//
function _controlselect(inst,name,option)
{
	inst.svcomm.SendActionEvent( 'dropdown', name, option )
}

//
//	_controlradio: callback for a radio selector...
//
function _controlradio(inst,name,option)
{
	inst.svcomm.SendActionEvent( 'radio', name, option );
}

//
//	_control_tfclick: callback for a text field...
//
function _control_tfclick(inst, name, field)
{
	inst.svcomm.SendActionEvent( 'text_field', name, field )
}

//
//	_control_pageclick: callback for a page control...
//
function _control_pageclick(inst,pg)
{
	//	iterate through all controls...
	for (var ky in inst.svobjs )
	{
		var val = inst.svobjs[ky];
		var ctl = val['ctl'];

		//	call its showpage method...
		try
		{
			ctl.ShowPage(pg);
		}
		catch (err)
		{
			inst.log(1,'svfactory: error showing page->' + err.description);
		}
	}

	//	update the global current page...
	inst['curpage'] = pg;
}


//
//      _createcontrol: creates a control object...
//
SVFactory.prototype._createcontrol = function(inst, obj)
{
        // get the obj name...
        var name = obj.name;

	var z = obj['z'];
	if (z == null) z = "-1";

        // create a div w/style via DOM...
        var div = document.createElement('div');
        div.setAttribute('id',name);
        div.setAttribute('style','z-index:' + z +  ';position:absolute;left:0px;top:0px;width:100;height:100;background-color:white;');
        div.setAttribute('width','200');
        div.setAttribute('height','200');
        document.body.appendChild(div);
        _adjustdiv( obj, name );

	//
	//	get some parms...
	//

	//	buttons...
	var buttons = obj['buttons'];

	var button_width = obj['button_width'];

	//	select...
	var dropdown = obj['drop_down'];

	//	radio buttons...
	var rb = obj['radio_buttons'];

	//	text field...
	var tf = obj['text_field'];

	//	logo...
	var logo = 'scravizo.png';
	var logovis = obj['logo'];

	//	page...
	var page = obj['page'];


        var svcontrol = new SVControl( {
                                                'div_control':name,
                                                'buttons':buttons,
                                                'logo': 'scravizo.png',
						'logovis': logovis,
						'click': _controlclick,
						'cb_obj': inst,
						'drop_down': dropdown,
						'select': _controlselect,
						'radio_buttons': rb,
						'radio': _controlradio,
						'text_field':tf,
						'tfclick': _control_tfclick,
						'pageclick': _control_pageclick,
						'page': page,
						'button_width':button_width,
						'parent': div
                                             } );

	//	do some init...
        svcontrol.Init();
        svcontrol.ShowPage( inst['curpage'] );

	//	stash the obj reference...
        obj['ctl'] = svcontrol;

        //	save this item in global dct...
        inst.svobjs[ name ] = obj;
}

//
//      _createtable: creates a table object...
//
SVFactory.prototype._createtable = function(inst, obj)
{
        // get the obj name...
        var name = obj.name;

	var z = obj['z'];
	if (z == null) z = "-1";

        var bg_color = "#808080";
        if (obj.background_color!=null) bg_color = "" + obj.background_color + "";

        // create a div w/style via DOM...
        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','z-index:' + z +  ';position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + bg_color + ';border-radius: 15px;');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

	var title = obj['title'];
	var pp = document.createElement('p');
	pp.setAttribute('style',"width:100%;text-align:center;font-weight: bold;font-size:medium;");
	pp.innerHTML = title;
	odiv.appendChild(pp);

	var div = document.createElement('div');
        div.setAttribute('id', name);
        var x = 10;
        var y = 10 + 22;
        var width = Number( obj.width ) - 20;
        var height = Number( obj.height ) - 20 - 22;
        var divstyle = 'position:absolute;background-color:' + bg_color + ';left:' + x + 'px;top: ' + y + 'px;width:' + width + 'px;height:' + height + 'px;';
        div.setAttribute('style',divstyle);
        odiv.appendChild(div);

        //
        //      get some parms...
        //
	var cols = obj['columns'];
	var page = obj['page'];

	//	create the table object...
        var svtable = new SVTable( {
                                                'div_table':name,
						'columns':cols,
						'page':page,
						'parent':odiv
                                             } );

	//	do some init...
        svtable.ShowPage( inst['curpage'] );

        // stash the obj reference...
        obj['ctl'] = svtable;

        // create an interval function to update this list...
        var interval = obj.interval;
	var cb_interval = null;
	if ( ie != undefined )
        {
                cb_interval = setInterval( function() {
                        _args = [ inst, name ];
                        _tabletimeout( _args ); },
                        Number(interval) );
        }
	else
        	cb_interval = setInterval( _tabletimeout, Number(interval), [ inst, name ] );

        // stash the cb ref...
        obj['cb_ref'] = cb_interval

        // save this item in global dct...
        inst.svobjs[ name ] = obj;

}

//
//	_creategantt:  Creates an svgantt object...
//
SVFactory.prototype._creategantt = function(inst, obj)
{
        // get the obj name...
        var name = obj.name;

        var bg_color = "#808080";
        if (obj.background_color!=null) bg_color = "" + obj.background_color + "";

        // create a div w/style via DOM...
        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + bg_color + ';border-radius: 15px;');
        //odiv.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:green;border-radius: 15px;');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

        var title = obj['title'];
        var pp = document.createElement('p');
        pp.setAttribute('style',"width:100%;text-align:center;font-weight: bold;font-size:medium;color:white;padding-bottom:10px;");
        pp.innerHTML = title;
        odiv.appendChild(pp);

        var div = document.createElement('div');
        div.setAttribute('id', name);
        var x = 10;
        var y = 10 + 35;
        var width = Number( obj.width ) - 20;
        var height = Number( obj.height ) - 20 - 35;
        var divstyle = 'position:absolute;background-color:' + bg_color + ';left:' + x + 'px;top: ' + y + 'px;width:' + width + 'px;height:' + height + 'px;';
        div.setAttribute('style',divstyle);
        odiv.appendChild(div);

        //
        //      get some parms...
        //
        var cols = obj['columns'];
        var page = obj['page'];

        //      create the table object...
        var svgantt = new SVGantt( {
                                                'div_gantt':name,
                                                'page':page,
                                                'parent':odiv
				} );

        //      do some init...
        svgantt.ShowPage( inst['curpage'] );

        // stash the obj reference...
        obj['ctl'] = svgantt;

        // create an interval function to update this list...
        var interval = obj.interval;
        var cb_interval = null;
        if ( ie != undefined )
        {
                cb_interval = setInterval( function() {
                        _args = [ inst, name ];
                        _gantttimeout( _args ); },
                        Number(interval) );
        }
        else
	{
                cb_interval = setInterval( _gantttimeout, Number(interval), [ inst, name ] );
	}

        // stash the cb ref...
        obj['cb_ref'] = cb_interval

        // save this item in global dct...
        inst.svobjs[ name ] = obj;

}

//
//      _gantttimeout: callback function for a gantt object...
//
function _gantttimeout( args )
{
        var inst = null;
        try
        {
                inst = args[0];
                var name = args[1];

                //      get the svgantt object...
                var svgantt = inst._get_ctl(name);
                if ( svgantt == null )
                {
                        inst.log(1, 'Cannot find gantt object with name->' + name );
                        return;
                }

                //      make comm call to get gantt items...
                var items = inst.svcomm.SendGanttDataRequest( name );

                inst.log(3, 'svfactory: _gantttimeout: got web service response->' + items );

                if ( items == "done" )
                {
                        if ( inst.svobjs[name]['cb_ref']!=null)
                        {
                                window.clearInterval( inst.svobjs[name]['cb_ref'] );
                                inst.svobjs[name]['cb_ref'] = null;
                        }
                        return;
                }
                else if ( items == "wait" )
                {
                        return;
                }
                else
                {
                        inst.log(3, 'svfactory: _gantttimeout: adding items->' + items );

                        //      TODO: get the refresh policy of this object...
                        var b_refresh = false;

                        // add the items...
                        svgantt.AddItems( items, b_refresh );
                }
        }
        catch (err)
        {
                if ( inst!=null )
                        inst.log(1, 'svfactory: An error in svfactory/_gantttimeout:  ' + err);
                else
                        console.log('svfactory: An error in svfactory/_gantttimeout:  ' + err);
        }
}



//
//	_tabletimeout: callback function for a table object...
//
function _tabletimeout( args )
{
	var inst = null;
        try
        {
                inst = args[0];
                var name = args[1];

                //	get the svtable object...
                var svtable = inst._get_ctl(name);
		if ( svtable == null )
		{
			inst.log(1, 'Cannot find table object with name->' + name );
			return;
		}

                //	make comm call to get table items...
                var items = inst.svcomm.SendTableDataRequest( name );

                inst.log(3, 'svfactory: _tabletimeout: got web service response->' + items );

                if ( items == "done" )
                {
			if ( inst.svobjs[name]['cb_ref']!=null)
                        {
                                window.clearInterval( inst.svobjs[name]['cb_ref'] );
                                inst.svobjs[name]['cb_ref'] = null;
                        }
			return;
                }
                else if ( items == "wait" )
                {
			return;
                }
                else
                {
                        inst.log(3, 'svfactory: _tabletimeout: adding items->' + items );

			//	TODO: get the refresh policy of this object...
			var b_refresh = false;

                        // add the items...
                        svtable.AddData( items, b_refresh );
                }
        }
        catch (err)
        {
		if ( inst!=null )
                	inst.log(1, 'svfactory: An error in svfactory/_tabletimeout:  ' + err);
		else
                	console.log('svfactory: An error in svfactory/_tabletimeout:  ' + err);
        }
}

//
//      _createlist: creates a list object... see code in svlist
//
SVFactory.prototype._createlist = function(inst, obj)
{
	// get the obj name...
        var name = obj.name;

	var z = obj['z'];
	if (z == null) z = "-1";

	var background_color = obj['background_color'];
	if (background_color==null) background_color = "#808080";

	var border = obj['border'];
	if (border==null) border = "1px solid white";

	var border_radius = obj['border_radius'];
	if (border_radius==null) border = "15px";

	// var bg_color = "#808080";
	// if (obj.background_color!=null) bg_color = "" + obj.background_color + "";

        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','z-index:' + z +  ';position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + background_color + ';border:' + border +  ';border-radius:'+ border_radius + ';');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

	// create title div, if there is one
	if (obj['title']=='on') {
	    var title_color = obj['title_color'];
	    var title_align = obj['title_align'];
	    var title_font_family = obj['title_font_family'];
	    var title_font_size = obj['title_font_size'];
	    var title_font_style = obj['title_font_style'];
	    var title_text = obj['title_text'];
	    var title_div1 = document.createElement('div');
	    var title_start = parseInt(title_font_size, 10);
	    title_div1.setAttribute('id','title_' + name);
	    title_div1.setAttribute('style','position:absolute;left:10px;top:0px;width:'+ (obj.width-20) +';height:'+ (title_start+10)+ ';font-style:'+ title_font_style + ';font-family:' + title_font_family +  ';font-size:' + title_font_size + ';background-color:' + background_color + '; color:' + title_color + ';text-align:' + title_align + ';');
	    title_div1.setAttribute('width','200');
	    title_div1.setAttribute('height','20');
	    title_div1.innerHTML = title_text;
	    odiv.appendChild(title_div1);
	}

        // create a div w/style via DOM...
        var div = document.createElement('div');
        div.setAttribute('id',name);
        div.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + background_color + ';overflow-y:scroll;');
	div.setAttribute('width','200');
	div.setAttribute('height','200');
        odiv.appendChild(div);
	if (obj['title']=='on') {
	    var title_font_size = obj['title_font_size'];
	    var title_start = parseInt(title_font_size, 10);
	    _adjustdiv( {name:name, width:obj.width-20,height:obj.height-(20 + title_start),x:10,y:title_start+10}, name );
	} else {
	    _adjustdiv( {name:name, width:obj.width-20,height:obj.height-20,x:10,y:10}, name );
	}

	// get some parms...
	var prepend_or_append = obj['prepend_or_append'];


	var text_color = obj['text_color'];
	if (text_color==null) text_color = "white";

	var text_font_size = obj['text_font_size'];
	if (text_font_size == null) text_font_size = "12px";

	var text_font_family = obj['text_font_family'];
	if (text_font_family == null) text_font_family = "times";

	var text_font_style = obj['text_font_style'];
	if (text_font_style == null) text_font_style = "normal";

	var title = obj['title'];
	if (title==null) title = "off";

	var title_color = obj['title_color'];
	if (title_color==null) title_color = "white";

	var title_font_size = obj['title_font_size'];
	if (title_font_size == null) title_font_size = "12px";

	var title_font_family = obj['title_font_family'];
	if (title_font_family == null) title_font_family = "times";

	var title_font_style = obj['title_font_style'];
	if (title_font_style == null) title_font_style = "normal";

	var page = obj['page'];

        //	create the sv list...
        svlist = new SVList( { 
		'div_list':name,
		'prepend_or_append':prepend_or_append,
		'text_color':text_color,
		'text_font_size':text_font_size,
		'text_font_family':text_font_family,
		'text_font_style':text_font_style,
		'background_color':background_color,
		'title':title,
		'title_color':title_color,
		'title_font_size':title_font_size,
		'title_font_family':title_font_family,
		'title_font_style':title_font_style,
		'parent':odiv,
		'page': page
			});

	//	do some init...
	svlist.ShowPage( inst['curpage'] );

	// 	stash the obj reference...
        obj['ctl'] = svlist;

        // 	create an interval function to update this list...
        var interval = obj.interval;
	var cb_interval = null;
	if ( ie != undefined )
        {
                cb_interval = setInterval( function() {
                        _args = [ inst, name ];
                        _listtimeout( _args ); },
                        Number(interval) );
        }
	else
	{
		cb_interval = setInterval( _listtimeout, Number(interval), [ inst, name ] );	
	}

	// stash the cb ref...
        obj['cb_ref'] = cb_interval

        // save this item in global dct...
        inst.svobjs[ name ] = obj;
}

//
//      _createmap: create a map object...
//
SVFactory.prototype._createmap = function(inst, obj)
{
        //	get the obj name...
        var name = obj.name;

	var z = obj['z'];
	if (z == null) z = "-1";

	var border = obj['border'];
	if (border==null) border = "0px solid white";

	var border_radius = obj['border_radius'];
	if (border_radius==null) border = "15px";

        var bg_color = "gray";
        if (obj.background_color!=null) bg_color = obj.background_color;

        //	create a div w/style via DOM...
        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','z-index:' + z +  ';position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + bg_color + ';border:' + border + ';border-radius:'+ border_radius + ';');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

        //	create a div w/style via DOM...
        var div = document.createElement('div');
        div.setAttribute('id',name);
	var x = 10;
	var y = 10;
	var width = Number( obj.width ) - 20;
	var height = Number( obj.height ) - 20;
	var divstyle = 'position:absolute;background-color:' + bg_color + ';left:' + x + 'px;top: ' + y + 'px;width:' + width + 'px;height:' + height + 'px;';
        div.setAttribute('style',divstyle);
        odiv.appendChild(div);

	//	create a canvas w/style via DOM...
	var canvas_name = name + '_canvas';
	//var canvas_name = 'mapOverlay';
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', canvas_name);
	var canvasstyle = 'pointer-events:none;z-index:2;' + 
		'position:absolute;background-color:transparent;left:' + x + 'px;top: ' + y + 'px;width:' + width + 'px;height:' + height + 'px;';
        canvas.setAttribute('style', canvasstyle);
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	odiv.appendChild(canvas);

	//	form an init gps bounds...
	var l = obj.left;
	var b = obj.bottom;
	var r = obj.right;
	var t = obj.top;
	var bounds = [ l, b, r, t ];

	//	get page...
	var page = obj['page'];

	//	get gis or image...
	var gis_or_image = obj['gis_or_image'];
	var image= obj['image'];
	var top = obj['top'];
	var bottom = obj['bottom'];
	var left = obj['left'];
	var right = obj['right'];

        //	create the sv gis...
        var svgis = new SVGis( { 
		'name':name, 
		'init_bounds': bounds, 
		'div_map':name,
		'canvas_overlay':canvas_name,
		'page':page,
		'parent':odiv,
		'gis_or_image':gis_or_image,
		'image':image,
		'top':top,
		'bottom':bottom,
		'left':left,
		'right':right,
		'canvas_obj':canvas
 		} );

	//	init the control...
        svgis.ShowPage( inst['curpage'] );

	//	stash the object...
        obj['ctl'] = svgis;

        //	save the object in global dct...
        inst.svobjs[ name ] = obj;

        //	create an interval function to update this list...
        var interval = obj.interval;
        var cb_interval = null;
	if ( ie != undefined )
        {
                cb_interval = setInterval( function() {
                        _args = [ inst, name ];
                        _maptimeout( _args ); },
                        Number(interval) );
        }
	else
		cb_interval = setInterval( _maptimeout, Number(interval), [ inst, name ] );

	//	save the cb ref...
        obj['cb_ref'] = cb_interval

	//	deal with any bindings...
	if (obj['tree'] != null)
	{
		var tree_name = obj['tree'];
		inst.bindings[tree_name] = name;
		inst.bindings[name] = tree_name;
	}
}

//
//	_treeclick: callback for the tree object...
//
function _treeclick( inst, path, data, obj )
{
	var tree_name = inst['name'];

	//	see if there is a binding to another object...
	var map_binding = obj.bindings[tree_name];
	if ( map_binding!=null )
	{
		// get the map obj...
		var map_obj = obj.svobjs[map_binding];
		if ( map_obj!=null )
		{
			var map_ctl = map_obj['ctl'];

			// if array of 4, its gps extents...
			if ( data.length==4 )
			{
				map_ctl.NavigateToExtents( data );
			}
			else
			{
				// TODO: also navigate to a marker (2 coords)...
			}
		}
	}
}

//
//      _createtree: creates a tree object...
//
SVFactory.prototype._createtree = function(inst, obj)
{
        //	get the obj name...
        var name = obj.name;

        var bg_color = "gray";
        if (obj.background_color!=null) bg_color = obj.background_color;

        //	create a div w/style via DOM...
        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + bg_color + ';border-radius: 15px;');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

        //	create a div w/style via DOM...
        var div = document.createElement('div');
        div.setAttribute('id',name);
        div.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + bg_color + ';overflow-y:scroll;');
        odiv.appendChild(div);
	_adjustdiv( {name:name, width:obj.width-20,height:obj.height-20,x:10,y:10}, name );

	//	page...
	var page = obj['page'];

        //	create the sv tree...
        svtree = new SVTree( { 'name':name, 'div_tree':name, 'click':_treeclick, 'cb_obj': inst, 'parent': odiv, 'page':page  } );

	//	do some init...
        svtree.ShowPage( inst['curpage'] );

	//	stash the object ref...
        obj['ctl'] = svtree;

        //	save this item in global dct...
        inst.svobjs[ name ] = obj;

        //	create an interval function to update this list...
        var interval = obj.interval;
        var cb_interval = null;
	if ( ie != undefined )
        {
                cb_interval = setInterval( function() {
                        _args = [ inst, name ];
                        _treetimeout( _args ); },
                        Number(interval) );
        }
	else
		cb_interval = setInterval( _treetimeout, Number(interval), [ inst, name ] );

	//	save the cb ref...
        obj['cb_ref'] = cb_interval

	//	setup initial paths...
	var paths = obj.paths;
	svtree.AddPaths( paths, true );
}

//
//	_on_thresh_click: callback for clicking on a data point...
//
function _on_thresh_click( inst, name, series_name, x, y )
{
	inst.svcomm.SendChartActionEvent( 'chart', name, series_name, x, y );
}

//
//	_createchart: creates a chart object...
//
SVFactory.prototype._createchart = function(inst, obj)
{
        //	get the obj name...
        var name = obj.name;

	var background_color = obj['background_color'];
	if (background_color==null) background_color = "#808080";

	var border = obj['border'];
	if (border==null) border = "0px solid white";

	var border_radius = obj['border_radius'];
	if (border_radius==null) border = "15px";

        // var bg_color = "gray";
        // if (obj.background_color!=null) bg_color = obj.background_color;

        //	create a div w/style via DOM...
        var odiv = document.createElement('div');
        odiv.setAttribute('id','o_' + name);
        odiv.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + background_color + ';border:' + border +  ';border-radius:' + border_radius + ';');
        document.body.appendChild(odiv);
        _adjustdiv( obj, 'o_' + name );

        //	create a div w/style via DOM...
        var div = document.createElement('div');
        div.setAttribute('id',name);
        div.setAttribute('style','position:absolute;left:0px;top:0px;width:100;height:100;background-color:' + background_color + ';');
        odiv.appendChild(div);
        _adjustdiv( {name:name, width:obj.width-20,height:obj.height-20,x:10,y:10}, name );

	//	some chart params...
	var title = obj.title;
	var window_points = obj.window_points;
	var series_name = obj.series_name;
	var chart_start = obj.chart_start;
	var shift = obj.shift;
	var points_or_lines_or_area = obj.points_or_lines_or_area;
	var stacking = obj.stacking;

	//	page...
	var page = obj['page'];

	//	subtype...
	var subtype = obj['subtype'];

	//	direction...
	var direction = obj['direction'];

	//	categories...
	var categories = obj['categories'];

	//	threshold...
	var threshold = obj['threshold'];

	//	xtype...
	var xtype = obj['x_type'];

	//	animation...
	var animation = obj['animation'];

	//	yrange...
	var y_range = obj['y_range'];

	//	ytype...
	var y_type = obj['y_type'];

	//	bar_labels...
	var bar_labels = obj['bar_labels'];

	//	datetime format for x label...
	var x_dt_f = obj['x_datetime_format'];

	//	regression line...
	var line = obj['line'];

        //	create the svchart...
	var inst = this;
        var svchart = new SVChart( { 
		'name': name,	
		'div_chart':name, 
		'title':title, 
		'window_points':Number(window_points), 
		'series_name':series_name,
		'chart_start':chart_start,
		'shift':shift,
		'points_or_lines_or_area':points_or_lines_or_area,
		'stacking':stacking,
		'page':page,
		'parent':odiv,
		'subtype':subtype,
		'direction':direction,
		'categories':categories,
		'threshold': threshold,
		'threshclick': _on_thresh_click,
		'threshdata': inst,
		'cb_error': _cb_error,
		'cb_obj': inst,	
		'x_type': xtype,
		'animation': animation,
		'y_range': y_range,
		'y_type':y_type,
		'bar_labels':bar_labels,
		'x_datetime_format': x_dt_f,
		'line': line
		} );

	//	do some init...
        svchart.ShowPage( inst['curpage'] );

	//	stash the object...
	obj['ctl'] = svchart;

        //	save this item in global dct...
        inst.svobjs[ name ] = obj;

        //	create an interval function to update this list...
        var interval = obj.interval;
	var cb_interval = null;
	if ( ie != undefined )
	{
        	cb_interval = setInterval( function() {
			_args = [ inst, name ]; 
			_charttimeout( _args ); },
			Number(interval) );
	}
	else
	{
        	cb_interval = setInterval( _charttimeout, 
			Number(interval), [ inst, name ] );
	}

        //	save the cb ref...
        obj['cb_ref'] = cb_interval

        //	initialize chart items, if any...
        var points = inst.svcomm.SendChartDataRequest( name, true );
	if ( points == "done" )
	{
	}
	else if ( points == "wait" )
	{
	}
	else
        {
                svchart.AddPoints( points, true );
        }
}


//
//      _cb_init: The cb_init function...
//
SVFactory.prototype._cb_init = function(inst, obj)
{
	try
	{

		var name = obj.name;

        	if ( inst.hasOwnProperty(name) )
        	{
			inst.log(1,'svfactory: Error, updating not yet implemented!');
			return false;
        	}
        	else
        	{
        		inst._create( inst, obj );
			return true;
        	}
	}
        catch (err)
        {
                inst.log(1,'svfactory: An error in svfactory/_cb_init->' + err);
		return false;
        }

}

//
//	_cb_error: The cb_error function...
// 
function _cb_error(inst, message)
{
	inst.log(1, message);
}


//	
//	_init_call_again:  init_again callback during initialize phase...
//
function _init_call_again(obj)
{
	try
	{
		obj.log(3, "svfactory: inside _init_call_again");

		var retv = obj.svcomm.SendInitRequests( obj.next );

		// check if not done...
        	var done = retv[1];
        	if (!done)
        	{
                	// update next...
                	obj.next = retv[0];

                	setTimeout( _init_call_again, 1000, obj );
		}
        }
	catch (err)
	{
		obj.log(3, 'svfactory: _init_call_again: ' + err );
	}	
}

//
//	Init: The init function for svfactory...
//
SVFactory.prototype.Init = function()
{
	try
	{

		//	get the admin object going...
		this.svadmin.Init();

		//	get the comm object going...
		var retv = this.svcomm.SendInitRequests( this.next );
	
		//	check if not done...
		var done = retv[1];
		if (!done)
		{
			//	update next...
			this.next = retv[0];

			setTimeout( _init_call_again, 1000, this );
		}


	}
	catch ( err )
	{
		this.log(1, 'Error in init->' + err );
	}
}

