//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVAdmin( params )
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
	this.args = null;

}

var _args = null;

function _svadmin_timeout( args )
{
	var inst = args[0];
	var obj = args[1];

        //      Get the cb...
        if ( inst['cb_admin'] != null )
        {
                inst['cb_admin'](inst, obj);
        }
}

SVAdmin.prototype._timeout = function(args)
{
	_svadmin_timeout( args );	
}

SVAdmin.prototype.RemoveInterval = function()
{
	if ( this['cb_ref'] != null )
		window.clearInterval( this['cb_ref'] );
}

SVAdmin.prototype.Init = function()
{
	var obj = this['cb_obj'];
	var args = [ this, obj ];

	if (ie!=undefined) 
	{
		_args = args;
		var cb_ref = setInterval( function() { 
			_svadmin_timeout(_args); },
			1000  );
		this['cb_ref'] = cb_ref;
	}
	else
	{
		var cb_ref = setInterval( this._timeout, 1000, args);
		this['cb_ref'] = cb_ref;
	}
	
}
