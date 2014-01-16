//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVComm( params )
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

	// No valid url param ? Then, fake data for testing...
	this.fake = true;
	if ( this.hasOwnProperty('url') )
	{
		url = this['url'];
		if (url!=null) this.fake = false;
	}	

}

//
//	TODO: make this a member function and not global func...
//
function _clone(obj)
{
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = _clone(obj[key]);
    return temp;
}

//
//	SendError: Send an error string...
//
SVComm.prototype.SendError = function( message )
{
	if ( this.fake )
	{
       		//      get the fake data callback...
                var cb_fake = this['cb_fake'];

                //  TODO: what to do about global in eval statement below...
                _data = null;

                // form the command to send...
                var cmd = "error?message=" + encodeURI(message);

                // send it, get data back...
                var data = cb_fake( cmd );

                return data;

	}
	else
	{
                // get base url for web service...
                var base_url = this['url'];

                // form the final url...
                var url = base_url + '/error?message=' + encodeURI(message);

                //      TODO: make this non-global...
                _data = null;

                //      syncronous AJAX call (deprecated)
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                                _data = my_data;
                            },
                          error : function ()
                            {
                                 console.log('svcomm: ajax web service error!');
                            }
                        });

                 return _data;

	}
}


//
//	SendAdminRequest: Send the ADMIN command...
//
SVComm.prototype.SendAdminRequest = function()
{
        var cb_error = null;
        var cb_obj = null;

	try
	{

        	//      get some callbacks...
        	var cb_error = this['cb_error'];
		var cb_obj = this['cb_obj'];
	
		if (this.fake)
		{
			//      get the fake data callback...
                	var cb_fake = this['cb_fake'];

                	//  TODO: what to do about global in eval statement below...
                	_data = null;

			// form the command to send...
                	var cmd = "admin";

			// send it, get data back...
			var data = cb_fake( cmd );

			return data;
			
		}
		else
		{
			// get base url for web service...
                	var base_url = this['url'];

			// form the final url...
			var url = base_url + '/admin';

			//	TODO: make this non-global...
			_data = null;

			// 	syncronous AJAX call (deprecated)
                        $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
				_data = my_data;
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj);
                            }
                        });

			return _data;
		}
                
	}
	catch (err)
	{
		if (cb_error!=null)
			cb_error( cb_obj, "svfactory: _admin_timeout: " + err );
		else
			console.log( "svfactory: _admin_timeout: " + err );
	}
}



//
//      SendInitRequests:  Send the various INIT commands...
//
SVComm.prototype.SendInitRequests = function(next)
{
        var cb_error = null;
        var cb_obj = null;

	try
	{


		//	get some callbacks...
		var cb_init = this['cb_init'];
		cb_error = this['cb_error'];
		cb_obj = this['cb_obj'];

	
		if (this.fake) // fake data for testing...
		{


		// 	get the fake data callback...
		var cb_fake = this['cb_fake'];

                //  TODO: what to do about global in eval statement below...

                _data = null;

		var cmd = "main_init";
		if ( next ) cmd = "main_init_next";

		while (true)
		{
			//	make the call...
			data = cb_fake( cmd );


			if (data=="wait") return [next, false];
			else if (data=="done") return [next,true];;
	
			//	else its data...	
			eval("_data = " + data );
			var obj = _clone( _data );
			cb_init( cb_obj, obj );

			cmd = "main_init_next";
			next = true;
			
		}
	
		}
		else // make web service call...
		{

		// get base url for web service...
		var base_url = this['url'];

		//	determine which command to send...
		var url = base_url + '/main_init';
		if ( next )
			 url = base_url + '/main_init_next';	

		//  TODO: what to do about global in eval statement below...
		_data = null;
			
		// send various init calls to server until done...
		while (true)
		{
			var done = false;
			var wait = false;

			// syncronous AJAX call (deprecated)
                	$.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data) 
			    {
			      if (my_data=="done")
			        { _data = null; done = true; }
			      else if (my_data=="wait")
			        { _data = null; done = true; wait=true; }
			      else
				{  eval("_data = " + my_data); }
                            },
                          error : function () 
			    {
				if (cb_error !=null )
					cb_error(cb_obj,'web service error->' + url);
				wait = true;
                            }
                        });

			if (wait) return [next,false];
			else if (done) return [next,true];

			// process the data !...
			var obj = _clone( _data );
			cb_init( cb_obj, obj );

			// next call is '_next' call...
			url = base_url + '/main_init_next';
			next = true;
		}
		
	
		}
		//	TODO: should never get here...
		return [next,true];

	}
	catch (err)
	{
		console.log('svcomm: An error in svcomm/SendInitRequests->' + err);
		return [next,true];
	}
}


//
//      SendActionEvent:  Send an action command...
//
SVComm.prototype.SendActionEvent = function( type, name, val )
{
        var cb_error = null;
        var cb_obj = null;

        try
        {
                var cb_error = this['cb_error'];
                var cb_obj = this['cb_obj'];

		if (this.fake)
		{
			var cb_fake = this['cb_fake'];

                	var url = 'user_action?type=' + type + '&name=' + name + '&value=' + val;

			cb_fake( url )
		}
		else
		{

			// get base url for web service...
                	var base_url = this['url'];

                	//      determine which command to send...
                	var url = base_url + '/user_action?type=' + type + '&name=' + name + '&value=' + val;

			// syncronous AJAX call (deprecated)
                        $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
				// TODO: anything to do here ?
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

		}

	}
	catch (err)
        {
		if (cb_error!=null)
                	cb_error(cb_obj,'svcomm: An error in svcomm/SendActionEvent->' + err);
		else
                	console.log('svcomm: An error in svcomm/SendActionEvent->' + err);
        }
}

//
//	SendChartActionEvent: send an action event related to a chart...
//
SVComm.prototype.SendChartActionEvent = function( type, name, series_name, x, y )
{
        var cb_error = null;
        var cb_obj = null;

        try
        {
	        var cb_error = this['cb_error'];
                var cb_obj = this['cb_obj'];


                if (this.fake)
                {
                        var cb_fake = this['cb_fake'];

                        var url = 
				'user_action?type=' + type + 
					'&name=' + name + 
					'&series=' + series_name +
					'&x=' + x +
					'&y=' + y;
				

                        cb_fake( url )
                }
                else
                {

                        // get base url for web service...
                        var base_url = this['url'];

                        //      determine which command to send...
                        var url = base_url + '/' + 
				'user_action?type=' + type + 
					'&name=' + name + 
					'&series=' + series_name +
					'&x=' + x +
					'&y=' + y;

                        // syncronous AJAX call (deprecated)
                        $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                                // TODO: anything to do here ?
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                }

        }
        catch (err)
        {
		if (cb_error!=null)
                	cb_error(cb_obj,'svcomm: An error in svcomm/SendChartActionEvent->' + err);
		else
                	console.log('svcomm: An error in svcomm/SendChartActionEvent->' + err);
        }
}


//
//      SendMapDataRequest:  Send the MAP data command...
//
SVComm.prototype.SendMapDataRequest = function(name, init )
{
	var cb_error = null;
	var cb_obj = null;

        try
        {
        

	cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];


        if (this.fake)
        {
                var cb_fake = this['cb_fake'];

                var url = 'map_data?name=' + name;
		if (init>0)
			url = url + '&init=1';
                var data = cb_fake( url );
		if (data=="done")
		{
			return "done";
		}
		else if (data=="wait")
		{
			return "wait";
		}
		else
		{
                	eval( "_data = " + data );
                	var obj = _clone( _data );
                	return obj;
		}
        }
        else
        {
                // get base url for web service...
                var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/map_data?name=' + name ;
		if (init)
			url = url + '&init=1';

                // TODO: what to do about global in eval statement below...
                _data = [];

                // make the ajax call...
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = "done"; }
                              else if (my_data=="wait")
                                { _data = "wait"; }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                return _data;
        }

        }
        catch (err)
        {
		if ( cb_error!= null )
                	cb_error(cb_obj,'svcomm: An error in svcomm/SendMapDataRequest->' + err);
		else
                	console.log('svcomm: An error in svcomm/SendMapDataRequest->' + err);
        }
}




//
//      SendTreeDataRequest:  Send the TREE data command...
//
SVComm.prototype.SendTreeDataRequest = function(name, init)
{
        var cb_error = null;
        var cb_obj = null;

        try
        {

        cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];


        if (this.fake)
        {
                var cb_fake = this['cb_fake'];

                var url = 'tree_data?name=' + name;
		if (init)
			url = url + '&init=1';

                var data = cb_fake( url );
	
		if ( data=="done" )
		{	
			return "done";
		}
		else if ( data == "wait" )
		{
			return "wait";
		}
		else
		{
                	eval( "_data = " + data );
                	var obj = _clone( _data );
                	return obj;
		}
        }
        else
        {
                // get base url for web service...
                var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/tree_data?name=' + name;
                if (init)
                        url = url + '&init=1';

                // TODO: what to do about global in eval statement below...
                _data = [];

                // make the ajax call...
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = "done";  }
                              else if (my_data=="wait")
                                { _data = "wait";  }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                return _data;
        }

        }
        catch (err)
        {
		if ( cb_error!=null )
                	cb_error(cb_obj,'svcomm: An error in svcomm/SendTreeDataRequest->' + err);
		else
                	console.log('svcomm: An error in svcomm/SendTreeDataRequest->' + err);
        }
}

//
//      SendGanttDataRequest:  Send the GANT data command...
//
SVComm.prototype.SendGanttDataRequest = function(name)
{
        var cb_error = null;
        var cb_obj = null;
        var data = null;

        try
        {

        cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];

        if (this.fake)
        {
                var cb_fake = this['cb_fake'];

                var url = 'gantt_data?name=' + name;
                data = cb_fake( url );

                if ( data == "wait" )
                {
                        return "wait";
                }
                else if ( data == "done" )
                {
                        return "done";
                }

                eval( "_data = " + data );

                var obj = _clone( _data );
                return obj;

        }
        else
        {
                // get base url for web service...
                var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/gantt_data?name=' + name;

                // TODO: what to do about global in eval statement below...
                _data = [];

                // make the ajax call...
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = "done"; }
                              else if (my_data=="wait")
                                { _data = "wait"; }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                return _data;
        }

        }
        catch (err)
        {
                if ( cb_error!= null )
                        cb_error( cb_obj, 'svcomm: An error in svcomm/SendGanttDataRequest->' + err + ' data->' + data);
                else
                        console.log( 'svcomm: An error in svcomm/SendGanttDataRequest->' + err + ' data->' + data);
        }
}


//
//      SendChartDataRequest:  Send the CHART data command...
//
SVComm.prototype.SendChartDataRequest = function(name)
{
        var cb_error = null;
        var cb_obj = null;
	var data = null;

        try
        {

        cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];


        if (this.fake)
        {
                var cb_fake = this['cb_fake'];

                var url = 'chart_data?name=' + name;
                data = cb_fake( url );


		if ( data == "wait" )
		{
			return "wait";
		}
		else if ( data == "done" )
		{
			return "done";
		}

                eval( "_data = " + data );

                var obj = _clone( _data );
                return obj;

        }
        else
        {
                // get base url for web service...
		var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/chart_data?name=' + name;

                // TODO: what to do about global in eval statement below...
                _data = [];

                // make the ajax call...
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = "done"; }
                              else if (my_data=="wait")
                                { _data = "wait"; }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                return _data;
        }

        }
        catch (err)
        {
		if ( cb_error!= null )
                	cb_error( cb_obj, 'svcomm: An error in svcomm/SendChartDataRequest->' + err + ' data->' + data);
		else
                	console.log( 'svcomm: An error in svcomm/SendChartDataRequest->' + err + ' data->' + data);
        }
}

//
//      SendTableDataRequest:  Send the Table data command...
//
SVComm.prototype.SendTableDataRequest = function(name)
{
        var cb_error = null;
        var cb_obj = null;

        try
        {

        cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];


        if (this.fake)
        {
                var cb_fake = this['cb_fake'];

                var url = 'table_data?name=' + name;
                var data = cb_fake( url );
	
                if (data=="done") return "done";
                else if ( data=="wait" ) return "wait";
	
                eval( "_data = " + data );
                var obj = _clone( _data );

                return obj;

        }
        else
        {
                // get base url for web service...
                var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/table_data?name=' + name;

                // TODO: what to do about global in eval statement below...
                _data = [];

                // make the ajax call...
                $.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = "done"; }
                              else if (my_data=="wait")
                                { _data = "wait"; }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

                return _data;
        }

        }
        catch (err)
        {
                if (cb_error !=null )
                	cb_error(cb_obj, 'svcomm: An error in svcomm/SendTableDataRequest->' + err);
		else
                	console.log(cb_obj, 'svcomm: An error in svcomm/SendTableDataRequest->' + err);
        }
}



//
//      SendListRequest:  Send the LIST data command...
//
SVComm.prototype.SendListDataRequest = function(name)
{
        var cb_error = null;
        var cb_obj = null;

	try
	{

        cb_error = this['cb_error'];
        cb_obj = this['cb_obj'];


	if (this.fake)
	{
		var cb_fake = this['cb_fake'];

		var url = 'list_data?name=' + name;
		var data = cb_fake( url );

		if (data=="done") return "done";
		else if ( data=="wait" ) return "wait";

		eval( "_data = " + data );

		var obj = _clone( _data );

		return obj;	
		
	}
	else
	{
		// get base url for web service...
                var base_url = this['url'];

                // initial call is '_init_ call...
                var url = base_url + '/list_data?name=' + name;

		// TODO: what to do about global in eval statement below...
		_data = [];

		// make the ajax call...
		$.ajax({
                          dataType: "text",
                          url : url,
                          async: false,
                          success : function (my_data)
                            {
                              if (my_data=="done")
                                { _data = ""; brk = true; }
                              else if (my_data=="wait")
                                { _data = ""; brk = true; }
                              else
                                {  eval("_data = " + my_data); }
                            },
                          error : function ()
                            {
                                if (cb_error !=null )
                                        cb_error(cb_obj,'web service error->' + url);
                            }
                        });

		return _data;
	}

	}
        catch (err)
        {
		if (cb_error!=null)
                	cb_error(cb_obj,'svcomm: An error in svcomm/SendListDataRequest->' + err);
		else
                	console.log('svcomm: An error in svcomm/SendListDataRequest->' + err);
        }
}

