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
                this[key] = params[key]

                nparms++;
        }

	//	initalize based on primary mode...

	if (this['gis_or_image'] == 'image')
	{   
	    //      initialize overlay canvas...
        	var canvas_name = this['canvas_overlay'];
        	var canvas = $("#" + canvas_name);
		if (ie)
		{
			canvas = this['canvas_obj'];
			this.context = canvas.getContext("2d");
		}
		else
        		this.context = canvas.get(0).getContext("2d");

        	var img     = new Image();
        	img.src     = this['image'];
        	this['main_img'] = img;
		var obj = this;
		img.onload = function(){ _deferred_init( obj, img ); };
	    
	}

	if ( this['gis_or_image'] == 'gis' ) 
	{
		return this._initgis();
	}

	if (this['gis_or_image'] == 'map_image')
	{   
	    //      initialize overlay canvas...
        	var canvas_name = this['canvas_overlay'];
        	var canvas = $("#" + canvas_name);
		if (ie)
		{
			canvas = this['canvas_obj'];
			this.context = canvas.getContext("2d");
		}
		else
        		this.context = canvas.get(0).getContext("2d");

        	var img     = new Image();
        	img.src     = this['image'];
        	this['main_img'] = img;
		var obj = this;
		img.onload = function(){ _deferred_init( obj, img ); };
	    
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
	this.markers = [];
	this.images = {};

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

	    if (ie)
		{
		//canvas = document.getElementById( "#" + canvas_name );
		canvas = this['canvas_obj'];
		this.context = canvas.getContext("2d");
		}
	    else
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
				this.DrawMarkers();
                                return;
                        }
                }

                //      got here, don't display...
                this.parent.style.display = "none";
        }
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

	if ( this['gis_or_image'] == 'gis' )
	{
		return this._nav_map(extents);
	}

	if ( this['gis_or_image'] == 'map_image' )
	{
		return this._nav_img(extents);
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

	// transparency...	
        var transparency = Number(dct.transparency);
	if (transparency)
	    marker.transparency = transparency;
	else marker.transparency = 1.0;

	// fadeouts true/false 
	var fadeouts = (dct.fadeouts == "true");
	if (fadeouts)
	    marker.fadeouts = fadeouts;
	else marker.fadeouts  = false;

	// fadeout counter -- fadeout per addmarkers call
	// (0 means no more fadeout ... 
	// you should (TODO) delete the marker at 0)
	marker.remove = false;
	
	var fadeout_factor = 1.0;
	var fadeout_number = Number(dct.fadeout_number);
	if (fadeout_number) {
	    marker.fadeout_number = fadeout_number;
	    if (marker.transparency) {
		marker.fadeout_alpha = marker.transparency;
		marker.fadeout_factor = marker.transparency / fadeout_number;
	    } else {
		marker.fadeout_alpha = 1.0;
		marker.fadeout_factor = 1.0 / fadeout_number;		
	    }
	} else {
	    marker.fadeout_number  = 10;
	}
	marker.fadeout_counter = fadeout_number;

	// gps pos...
	marker.lat = Number(dct.lat);
	marker.long = Number(dct.long);

	// gps pos 2 ...
	var lat2 = Number(dct.lat2);
	var long2 = Number(dct.long2);
	if (lat2)
	    marker.lat2 = lat2;
	else marker.lat2 = null;

	if (long2)
	    marker.long2 = long2;
	else marker.long2 = null;

	var z = Number(dct.z);
	if (z)
	    marker.z = z;
	else marker.z = 1;

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

	if ( this['gis_or_image'] == 'gis' )
	{
		return this._DMGis();
	}

	if ( this['gis_or_image'] == 'map_image' )
	{
		return this._DMMap_image();
	}

}

SVGis.prototype._DMimg = function()
{
	var canvas = this.context.canvas;
	var width = canvas.width;
	var height = canvas.height;
	var img = this['main_img'];

        this.context.clearRect(0, 0, width, height);
	this.context.globalAlpha = 1.0;
	this.context.drawImage( img, 0, 0, canvas.width, canvas.height );
}

SVGis.prototype._DMMap_image = function()
{
	    var canvas = this.context.canvas;
	    var width = canvas.width;
	    var height = canvas.height;
	    var img = this['main_img'];
	    this.context.clearRect(0, 0, width, height);
	    this.context.globalAlpha = 1.0;
	    this.context.drawImage( img, 0, 0, canvas.width, canvas.height );

	    /*
	    var last = this.markers.length - 1;
	    var new_markers = [];
	    for (var i=0; i < this.markers.length; i++)
	    {
		if (! this.marker[i].remove) new_markers.push( this.marker[i] );
	    }
	    this.markers = new_markers;
	    */

	    this.markers = this.markers.filter(function(v) { return v.remove ? false: true;});

	    // this.markers.sort(function(a,b){return (b.z - a.z);});
	    this.markers.sort(function(a,b){return (a.z - b.z);});

		// GREG

	    var top = Number(this['top']);
	    var bottom = Number(this['bottom']);
	    var left = Number(this['left']);
	    var right = Number(this['right']);

	    // var x_scale = (this.context.canvas.width/360.0);
	    // var y_scale = (this.context.canvas.height/180.0);

	    var x_scale = (this.context.canvas.width/(right - left));
	    var y_scale = (this.context.canvas.height/(top - bottom));

	/* iterate gps markers */
	for (var i = 0; i < this.markers.length; i++)
	{
		// get the marker item...
		var marker = this.markers[i];

		// skip faded markers
		if (marker.remove) {
		//    delete this.markers[i];
		    continue;
		}

		// extract lat/long...
		var lat = marker.lat;
		var lng = marker.long;

		/* get the gps position */
		var gps_position = [ Number(lat), Number(lng) ];
		var glon = gps_position[0];
		var glat = gps_position[1];

		// set default alpha...
		// this.context.globalAlpha = 1.0;

		// alpha ...
		if (marker.fadeouts) {
			    if (marker.fadeout_number == marker.fadeout_counter) {
				marker.fadeout_alpha = marker.transparency;
				marker.fadeout_counter = marker.fadeout_counter - 1;
			    } else {
				if (marker.fadeout_counter >= 0) {
				    marker.fadeout_alpha = marker.fadeout_alpha - marker.fadeout_factor;
				    marker.fadeout_counter = marker.fadeout_counter - 1;
				} else {
				    // mark marker for removal ... TODO
				    marker.fadeout_alpha = 0.0;
				    marker.remove = true;
				}
			    }
			    // just in case
			    if (marker.fadeout_alpha < 0.0) {
				    marker.fadeout_alpha = 0.0;
				    marker.remove = true;
			    }
			    this.context.globalAlpha = marker.fadeout_alpha;
		} else {
			    this.context.globalAlpha = marker.transparency;
		}
		if (marker.remove) continue;

		if (marker.shape=="circle")
		{

                	 this.context.beginPath();
			
			 var whole = marker.size;
			 var half = marker.size/2.0;
			 // this.context.arc((x_scale * (glon - (-180))), (y_scale * (90 - (glat))), half, 0, Math.PI*2, true);
			 this.context.arc((x_scale * (glon - (left))), (y_scale * (top - (glat))), half, 0, Math.PI*2, true);
		   
                	 this.context.closePath();

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
			// var c = [ (x_scale * (glon - (-180))) - half, (y_scale * (90 - (glat))) - half, marker.size, marker.size ];
			var c = [ (x_scale * (glon - (left))) - half, (y_scale * (top - (glat))) - half, marker.size, marker.size ];

			// alpha...
			// this.context.globalAlpha = marker.transparency;
		
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
		else if ( marker.shape == "line" )
		{
			// extract lat/long...
			var lat2 = marker.lat2;
			var lng2 = marker.long2;

			/* get the gps position */
			var gps_position2 = [ Number(lat2), Number(lng2) ];
			var glon2 = gps_position2[0];
			var glat2 = gps_position2[1];

			// alpha...
			// this.context.globalAlpha = marker.transparency;
		
			// fill the shape...	
			this.context.fillStyle = marker.color;
                        this.context.strokeStyle = this.context.fillStyle;
			/*
			    var ix1 = x_scale * (glon - (-180));
			    var iy1 = y_scale * (90 - (glat));
			    var ix2 = x_scale * (glon2 - (-180));
			    var iy2 = y_scale * (90 - (glat2));
			*/
			    var ix1 = x_scale * (glon - (left));
			    var iy1 = y_scale * (top - (glat));
			    var ix2 = x_scale * (glon2 - (left));
			    var iy2 = y_scale * (top - (glat2));

			    this.context.beginPath();
			    this.context.moveTo(ix1,iy1);
			    this.context.lineTo(ix2,iy2);
			    this.context.lineWidth = marker.size;
			    this.context.strokeStyle = marker.color;
			    this.context.stroke();
		}
		else if ( marker.shape == "image" )
		{
		    /*
			var image = marker.image;
			if ( image!=null )
			{
				var x = rx - image.width;
				var y = ry + image.height;
				this.context.drawImage( image, x, height - y);
			}
		    */
		}
	}

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

		// GREG
		var x_scale = (this.context.canvas.width/360.0);
		var y_scale = (this.context.canvas.height/180.0);

		if (marker.shape=="circle")
		{

                	this.context.beginPath();
			
			var whole = marker.size;
			var half = marker.size/2.0;
			// GREG
			// if (this['image'] != null) {
			    // this.context.arc((x_scale * (glon - (-180))) - (half - 6), (y_scale * (90 - (glat))) - (half - 6), half, 0, Math.PI*2, true);
			    // this.context.arc((x_scale * (glon - (-180))), (y_scale * (90 - (glat))), half, 0, Math.PI*2, true);
			// } else {
			    this.context.arc(rx, height - ry, half, 0, Math.PI*2, true);
			    //}
		   
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
		    // GREG
		    // var my_x = glon * Math.cos(glat);
		    // var my_y = glat;
		    // var my_x = parseInt(this['width']) * (glon + 180) / (2 * 180);
		    // var my_y = parseInt(this['height']) * (glat + 180) / (2 * 180);
		    // var my_x = 200;
		    // var my_y = 200;

			var half = Math.floor(marker.size/2.0);
			var c = [ rx - half, height - (ry + half), marker.size, marker.size ];

			// GREG
			// var my_x = ((this.context.canvas.width/2) - half) + glon;
			// var my_y = ((this.context.canvas.height/2) - half) + glat;

			// var my_x = this.context.canvas.width * ((-123 + 180) / (2 * 180));
			// var my_y = this.context.canvas.height * ((180 - 44) / (2 * 180));

			// if (this['image'] != null) {
			//    c = [ (x_scale * (glon - (-180))) - half, (y_scale * (90 - (glat))) - half, marker.size, marker.size ];
			//}

			// eugene
			// var my_x = x_scale * (-123 - (-180));
			// var my_y = y_scale * (90 - (44));

			// BAs
			// var my_x = x_scale * (-58.3 - (-180));
			// var my_y = y_scale * (90 - (-34.7));
			

			// alpha...
			this.context.globalAlpha = marker.transparency;
		
			// fill the shape...	
			this.context.fillStyle = marker.color;
                        this.context.strokeStyle = this.context.fillStyle;

			this.context.fillRect(c[0],c[1],c[2],c[3]);

			// GREG
			// this.context.fillStyle = "red";
                        // this.context.fillRect(my_x,my_y,20,20);

			 // possibly outline it...
                        if ( marker.border>0 )
                        {
                                this.context.lineWidth = marker.border;
                                this.context.strokeStyle = marker.border_color;
                                this.context.strokeRect(c[0],c[1],c[2],c[3]);
                        }
		}
		else if ( marker.shape == "line" )
		{
			// extract lat/long...
			var lat2 = marker.lat2;
			var lng2 = marker.long2;

			/* get the gps position */
			var gps_position2 = [ Number(lat2), Number(lng2) ];
			var glon2 = gps_position2[0];
			var glat2 = gps_position2[1];

			/* convert to map coordinates */
			var proj_position2     = new OpenLayers.LonLat(glon2,glat2).transform( this.fromProjection, this.toProjection);
			var plon2 = proj_position2.lon;
			var plat2 = proj_position2.lat;

			// normalize to 0 and 1...
			var nx2 = (plon2 - ml)/(mr - ml);
			var ny2 = (plat2 - mb)/(mt - mb);

			// get pixel coords...
			var rx2 = nx2*width;
			var ry2 = ny2*height;
		 
		        // var half = Math.floor(marker.size/2.0);
			// tripe length to start. see if we're modifying correctly.
			// var c = [ rx - half, height - (ry + half), marker.size, marker.size*3 ];
			
			// alpha...
			this.context.globalAlpha = marker.transparency;
		
			// fill the shape...	
			this.context.fillStyle = marker.color;
                        this.context.strokeStyle = this.context.fillStyle;

                        // this.context.fillRect(rx,ry,c[2],c[3]);

			// GREG
			// if ( this['gis_or_image'] == 'gis' ) {
			// if ( this['image'] == null ) {
			    this.context.beginPath();
			    this.context.moveTo(rx,height - ry);
			    this.context.lineTo(rx2,height - ry2);
			    this.context.lineWidth = marker.size;
			    this.context.strokeStyle = marker.color;
			    this.context.stroke();
			//} else {
			//    var ix1 = x_scale * (glon - (-180));
			//    var iy1 = y_scale * (90 - (glat));
			//    var ix2 = x_scale * (glon2 - (-180));
			//    var iy2 = y_scale * (90 - (glat2));
			//    this.context.beginPath();
			//    this.context.moveTo(ix1,iy1);
			//    this.context.lineTo(ix2,iy2);
			//    this.context.lineWidth = marker.size;
			//    this.context.strokeStyle = marker.color;
			//    this.context.stroke();
			    // }

			 // possibly outline it...
                        //if ( marker.border>0 )
                        //{
                        //        this.context.lineWidth = marker.border;
                        //        this.context.strokeStyle = marker.border_color;
                        //        this.context.strokeRect(c[0],c[1],c[2],c[3]);
                        //}
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


