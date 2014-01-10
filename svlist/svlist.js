//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVList( params )
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
	this.num_lines = 0;

}

//	TODO: make it a proto function...
function _clear(inst, div)
{
	while (div.hasChildNodes())
        {
        	div.removeChild(div.lastChild);
        }

        inst.num_lines = 0;
}

//
//	ShowPage: enable/disable this control based on page...
//
SVList.prototype.ShowPage = function(pg)
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

SVList.prototype.Reset = function()
{
	var div_name = this['div_list'];
        var div = document.getElementById(div_name);

	_clear(this, div);
}

// This section adds the text
SVList.prototype.AddItems = function(items, clear)
{
	var div_name = this['div_list'];
        var div = document.getElementById(div_name);

	if (clear>0)
	{
		_clear(this, div);
	}

	var append = true;
	if ( this['prepend_or_append'] == "prepend" )
		append = false;

	var color = this['text_color'];

	var font_size = this['text_font_size'];

	var font_family = this['text_font_family'];

	var font_style = this['text_font_style'];

	for (var i=0; i<items.length; i++)
	{
		if ( append )
		{
                	var ta = document.createElement('span');
                	// ta.innerText = items[i];
			ta.innerHTML = items[i];

			var style_string = "";
			if (color!=null) style_string = style_string + "color:" + color + ";";
			if (font_size!=null) style_string = style_string + "font-size:" + font_size + ";";
			if (font_family!=null) style_string = style_string + "font-family:" + font_family + ";";
			if (font_style!=null) style_string = style_string + "font-style:" + font_style + ";";
			ta.setAttribute('style',style_string);

                	div.appendChild(ta);
                	var br = document.createElement('br');
                	div.appendChild(br);
		}
		else
		{
			if (div.hasChildNodes())
			{
                        	var br = document.createElement('br');
                        	div.insertBefore(br, div.firstChild );
				
				var ta = document.createElement('span');
                                // ta.innerText = items[i];
				ta.innerHTML = items[i];

				var style_string = "";
				if (color!=null) style_string = style_string + "color:" + color + ";";
				if (font_size!=null) style_string = style_string + "font-size:" + font_size + ";";
				if (font_family!=null) style_string = style_string + "font-family:" + font_family + ";";
				if (font_style!=null) style_string = style_string + "font-style:" + font_style + ";";
				ta.setAttribute('style',style_string);
				
                                div.insertBefore(ta, div.firstChild );
			}
			else
			{
				var ta = document.createElement('span');
                        	// ta.innerText = items[i];
				ta.innerHTML = items[i];

				var style_string = "";
				if (color!=null) style_string = style_string + "color:" + color + ";";
				if (font_size!=null) style_string = style_string + "font-size:" + font_size + ";";
				if (font_family!=null) style_string = style_string + "font-family:" + font_family + ";";
				if (font_style!=null) style_string = style_string + "font-style:" + font_style + ";";
				ta.setAttribute('style',style_string);

                        	div.appendChild(ta);
                        	var br = document.createElement('br');
                        	div.appendChild(br);
			}
		}

		this.num_lines++;

		if ( this.num_lines >= 1000 ) _clear(this, div);
			
	}

	if (append) div.scrollTop = div.scrollHeight;
}

