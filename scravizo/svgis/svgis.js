//
//      Constructor...
//
function SVGis( params )
{
        //      TODO: validate params is a dct...

        //      Iterate param dictionary and process each...
        var nparms = 0;
        for (var key in params)
        {
                this._log( 'Processing init param->' + key );

                this[key] = params[key]

                nparms++;
        }

	//	initalize based on primary mode...
	if ( this['gis_or_image'] == 'image' )
	{
        	//      initialize overlay canvas...
        	var canvas_name = this['canvas_overlay'];
        	var canvas = $("#" + canvas_name);
        	this.context = canvas.get(0).getContext("2d");

        	var img     = new Image();
        	img.src     = this['image'];
        	this['main_img'] = img;
		var obj = this;
		img.onload = function(){ _deferred_init( obj, img ); };
	}
	else
	{
		return this._initgis();
	}
}

function _deferred_init( inst, img )
{
	inst._initimg();
}


SVGis.prototype._initimg = function()
{
	var img = this['main_img'];
	var context = this.context;
	var canvas = context.canvas;

	context.drawImage( img, 0, 0, canvas.width, canvas.height );
}

SVGis.prototype._initgis = function()
{

	var div_map 		= this['div_map'];
	this.map 		= new OpenLayers.Map(div_map);
        var mapnik         	= new OpenLayers.Layer.OSM();
        this.fromProjection 	= new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        this.toProjection   	= new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
	
	var l = this['init_bounds'][0];
	var b = this['init_bounds'][1];
	var r = this['init_bounds'][2];
	var t = this['init_bounds'][3];

        var m_lb = new OpenLayers.LonLat(l,b).transform( this.fromProjection, this.toProjection);
        var m_rt = new OpenLayers.LonLat(r,t).transform( this.fromProjection, this.toProjection);

        //      show at initial position...
        this.map.addLayer( mapnik );

	var m_extent = new OpenLayers.Bounds( m_lb.lon, m_lb.lat, m_rt.lon, m_rt.lat );
        var zoom = this.map.getZoomForExtent(m_extent, true);
	
        var center = m_extent.getCenterLonLat();
        this.map.setCenter( center,  zoom );

        //      get initial extents...
        this.cur_extent 	= this.map.getExtent();

	//	initialize overlay canvas...
        var canvas_name = this['canvas_overlay'];
        var canvas = $("#" + canvas_name);
        this.context = canvas.get(0).getContext("2d");

	//	map events...
	this.map.events.register('moveend',this, function(evt) { this.MapNavigated(); } );
	this.map.events.register('panend',this, function(evt) { this.MapNavigated(); } );
	this.map.events.register('zoomend',this, function(evt) { this.MapNavigated(); } );

	//	markers...
	this.markers = [];
        if ( this.hasOwnProperty('init_markers') )
        {
		this.markers = this['init_markers'];
        }

	//	image cache...
	this.images = {};
	
}

SVGis.prototype.ShowPage = function(pg)
{
        var ctlpage = this.page;
        if (ctlpage==null) ctlpage = 'all';

        if ( ctlpage=='all') 
        {
                this.parent.style.display = "inline";
		this.DrawMarkers();
        }
        else if (pg!=ctlpage)
        {
                this.parent.style.display = "none";
        }
        else
        {
                this.parent.style.display = "inline";
		this.DrawMarkers();
        }      
}

//
//      _log: log to console function for this library...
//
SVGis.prototype._log = function( obj )
{
        console.log( "SVGIS: " + obj );
}


function findPositionX(obj)
{
    var left = 0;
    if(obj.offsetParent)
    {
        while(1) 
        {
          left += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    }
    else if(obj.x)
    {
        left += obj.x;
    }
    return left;
}

function findPosY(obj)
{
    var top = 0;
    if(obj.offsetParent)
    {
        while(1)
        {
          top += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    }
    else if(obj.y)
    {
        top += obj.y;
    }
    return top;
}

//	
//	Function to respond to map navigation...
//	
SVGis.prototype.NavigateToExtents = function(extents)
{
	if ( this['gis_or_image'] == 'image' )
	{
		return this._nav_img(extents);
	}
	else
	{
		return this._nav_map(extents);
	}
}

SVGis.prototype._nav_img = function(extents)
{
	var img = this['main_img'];
        var context = this.context;
        var canvas = context.canvas;

	var scalex = extents[1] - extents[0];
	var scaley = extents[3] - extents[2];

	var width = canvas.width/( scalex );
	var height = canvas.height/ (scaley );

	var x = -( width * extents[0] )
	var y = -( width - canvas.width*1.0) + width * extents[2];
        context.drawImage( img, x, y, width, height );
}

SVGis.prototype._nav_map = function(extents)
{
        var l = extents[0];
        var b = extents[1];
        var r = extents[2];
        var t = extents[3];

        var m_lb = new OpenLayers.LonLat(l,b).transform( this.fromProjection, this.toProjection);
        var m_rt = new OpenLayers.LonLat(r,t).transform( this.fromProjection, this.toProjection);

        var m_extent = new OpenLayers.Bounds( m_lb.lon, m_lb.lat, m_rt.lon, m_rt.lat );
        var zoom = this.map.getZoomForExtent(m_extent, true);
        var center = m_extent.getCenterLonLat();
        this.map.setCenter( center,  zoom );

        this.cur_extent         = this.map.getExtent();

	this.DrawMarkers();

}

//
//	Function to navigate to an extents...
//
SVGis.prototype.MapNavigated = function(extent)
{
        this.cur_extent = this.map.getExtent();

	this.DrawMarkers();

}


// TODO: make a proto func...
function _image_onload( inst, img )
{
	inst.DrawMarkers();  // TODO: optimize: should only redraw the affected image... 
}

// TODO: make a proto func...
function _make_marker( inst, dct )
{
	var marker = {};

	// gps pos...
	marker.lat = Number(dct.lat);
	marker.long = Number(dct.long);
	
	// shape...
	marker.shape = dct.shape;

	// colors...
	marker.color = "#" + dct.color;
	marker.border_color = "#" + dct.border_color;

	// size...
	if (dct.size.indexOf("px") ) marker.size = Number( dct.size.substring(0, dct.size.length-2) );
	else marker.size = Number( dct.size );

	// border...
	if (dct.border.indexOf("px") ) marker.border = Number( dct.border.substring(0, dct.border.length-2) );
	else marker.border = Number( dct.border );
	
	// transparency...	
        marker.transparency = Number(dct.transparency);
        
	// image...
	var image_path = dct.image;
	if ( image_path!=null )
	{
		if ( inst.images[image_path] != null )
		{
			marker.image = inst.images[image_path];
		}
		else
		{
			var img     = new Image();
			img.src = image_path;
			img.onload = function(){ _image_onload( inst, img ); }; 
			inst.images[image_path] = img;
			marker.image = img;
		}
	}

	return marker;	
}

//
//      Function to add new markers...
//
SVGis.prototype.AddMarkers = function(data, clear)
{
	if (clear)
	{
		this.markers = [];
		this.images = {};
	}
	
	for ( var i=0; i<data.length; i++)
	{
		var dct= data[i];
		var marker = _make_marker(this, dct);
		this.markers.push( marker );
	}

	this.DrawMarkers();
}

//
//	Function to draw markers...
//
SVGis.prototype.DrawMarkers = function()
{
	if ( this['gis_or_image'] == 'image' )
	{
		return this._DMimg();
	}
	else
	{
		return this._DMGis();
	}
}

SVGis.prototype._DMimg = function()
{
        this.context.clearRect(0, 0, width, height);

}

SVGis.prototype._DMGis = function()
{
	//	get the div extents...
	var div_name             = this['div_map'];
	var map_div = document.getElementById( div_name );
	var x = findPositionX(map_div);
	var y = findPosY(map_div);
	var width = map_div.offsetWidth;
	var height = map_div.offsetHeight;

	this.context.clearRect(0, 0, width, height);

	/* iterate gps markers */
	for (var i = 0; i < this.markers.length; i++) 
	{
		// get the marker item...
		var marker = this.markers[i];

		// extract lat/long...
		var lat = marker.lat;
		var lng = marker.long;

		/* get the gps position */
		var gps_position = [ Number(lat), Number(lng) ];
		var glon = gps_position[0];
		var glat = gps_position[1];

		/* convert to map coordinates */
	        var proj_position     = new OpenLayers.LonLat(glon,glat).transform( this.fromProjection, this.toProjection);
		var plon = proj_position.lon;
		var plat = proj_position.lat;
		var ml = this.cur_extent.left; 
		var mb = this.cur_extent.bottom; 
		var mr = this.cur_extent.right; 
		var mt = this.cur_extent.top; 

		// normalize to 0 and 1...
		var nx = (plon - ml)/(mr - ml);
		var ny = (plat - mb)/(mt - mb);
		
		// get pixel coords...
		var rx = nx*width;
		var ry = ny*height;

		// set default alpha...
		this.context.globalAlpha = 1.0;

		if (marker.shape=="circle")
		{
                	this.context.beginPath();
                	this.context.arc(rx, height - ry, marker.size/2.0, 0, Math.PI*2, true);
                	this.context.closePath();
		
			// alpha...
			this.context.globalAlpha = marker.transparency;
	
			// fill the shape...	
                	this.context.fillStyle = marker.color;
			this.context.strokeStyle = this.context.fillStyle;
                	this.context.fill();
			
			// possibly outline it...
			if ( marker.border>0 ) 
			{
				this.context.lineWidth = marker.border;
				this.context.strokeStyle = marker.border_color;
				this.context.stroke();
			}
		}
		else if ( marker.shape == "square" )
		{
			var half = Math.floor(marker.size/2.0);
			var c = [ rx - half, height - (ry + half), marker.size, marker.size ];
			
			// alpha...
			this.context.globalAlpha = marker.transparency;
		
			// fill the shape...	
			this.context.fillStyle = marker.color;
                        this.context.strokeStyle = this.context.fillStyle;
                        this.context.fillRect(c[0],c[1],c[2],c[3]);

			 // possibly outline it...
                        if ( marker.border>0 )
                        {
                                this.context.lineWidth = marker.border;
                                this.context.strokeStyle = marker.border_color;
                                this.context.strokeRect(c[0],c[1],c[2],c[3]);
                        }
		}
		else if ( marker.shape == "image" )
		{
			var image = marker.image;
			if ( image!=null )
			{
				var x = rx - image.width;
				var y = ry + image.height;
				this.context.drawImage( image, x, height - y);
			}
		}
	}

}


