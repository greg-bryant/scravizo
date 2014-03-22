//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVControl( params )
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

	//	init the callbacks...
	this.click = this['click'];
	this.select = this['select'];
	this.radio = this['radio'];
	this.text = this['text'];
	this.tfclick = this['tfclick'];
	this.pgclick = this['pageclick'];

	this.button_width = this['button_width'];
	
	//	init the buttons...
	this.buttons = this['buttons'];

	//	init the toggle state...
	this.toggle_state = {};

}


SVControl.prototype.ShowPage = function(pg)
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

		//	got here, don't display...
               	this.parent.style.display = "none";
        }
}

//	TODO: make this proto in common...
function _appendStyle(styles) 
{
  var css = document.createElement('style');
  css.type = 'text/css';

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
}

//	TODO: make this proto function...
function _onclick(btn, inst, name, cb_obj, title, toggle, value, button_width )
{
	// figure out the current button title...
	var cur_title = btn.innerHTML;

        // greg's add (also 'value' at end of functions in this file, and any 'name_or_value' that you see)
        // use 'value' instead of name as a result value, if it's there.
        var name_or_value = cur_title;
        if (value!=null)
	    if (value.length > 0) 
	        name_or_value = value;
	
	// inst.click(cb_obj, name_or_value, cur_title);
	inst.click(cb_obj, name, name_or_value);

	// deal with a toggle button...
	if (toggle!=null)
	{
	if (btn.innerHTML == title )
	{
		btn.innerHTML = toggle;
		var width_string = "";
		if (button_width != null) {
		    width_string = "width:" + button_width + ";";
		}
		var btn_style = "border: 1px black solid; background-color: black; color: white;" + width_string;
		// var btn_style = "border: 1px black solid; background-color: black; color: white;";
        	btn.setAttribute('style', btn_style);
	}
	else
	{
		btn.innerHTML = title;
		var width_string = "";
		if (button_width != null) {
		    width_string = "width:" + button_width + ";";
		}
		var btn_style = "border: 1px black solid; background-color: white; color: black;" + width_string;
		// var btn_style = "border: 1px black solid; background-color: white; color: black;";
        	btn.setAttribute('style', btn_style);
	}
	}
	
}

//	TODO: make this a proto function...
function _on_over(ctl,toggle)
{
	if ( ctl.textContent == toggle )
	{
		ctl.style.color = "black";
		ctl.style.backgroundColor = "white";
	}
	else
	{
		ctl.style.color = "white";
		ctl.style.backgroundColor = "black";
	}
}

//	TODO: make this a proto function...
function _on_out(ctl,toggle)
{
	if ( ctl.textContent == toggle )
	{
		ctl.style.color = "white";
		ctl.style.backgroundColor = "black";
	}
	else
	{
		ctl.style.color = "black";
		ctl.style.backgroundColor = "white";
	}
}

//	TODO: make this a proto function...
function _onchange( sel, inst, name, cb_obj )
{
	var idx = sel.selectedIndex;

	var item = sel.options[idx].text;

        inst.select(cb_obj,name, item);

}

//	TODO: make this a proto function...
function _make_select(inst, parent, name, cb_obj, options )
{
	var sel = document.createElement("select");

	sel.onchange = function() { _onchange( sel, inst, name, cb_obj ) };

	var selectedIndex = 0;
	for (var o=0; o< options.length; o++)
	{
		var el = document.createElement("option")
		
		var item = options[o]['item'];
		el.innerHTML = item;

		//var name = 'opt_' + item;
		el.setAttribute('id', name );

		if ( options[o]['selected']=='yes' )
			selectedIndex = o;

		sel.appendChild(el);
	}

	sel.selectedIndex= selectedIndex;

	parent.appendChild(sel);
}

//      TODO: make this a proto function...
function _onradiochange( el, inst, name, cb_obj )
{
	inst.radio( cb_obj, name, el.value );
}

//      TODO: make this a proto function...
function _make_radio(inst, parent, cb_obj, name, options )
{
        var selectedIndex = 0;
        for (var o=0; o< options.length; o++)
        {
		// id for inp...
		var item = options[o]['item'];
                var id = 'inp_' + item;
			
		// make parent label...
		var lbl = document.createElement("label");
		lbl.setAttribute( "for", id );
		lbl.innerText = item;
		parent.appendChild(lbl);		

		// make radio...
                var el = document.createElement("input")
                el.setAttribute('type', 'radio' );

		// id...
                el.setAttribute('id', id );

		// group name...
		el.setAttribute('name',name);

		// value...
		el.setAttribute('value',item);

		// cb...
		el.onchange = function() { _onradiochange( el, inst, name, cb_obj ) };

                if ( options[o]['selected']=='yes' )
		{
                        selectedIndex = o;
			el.setAttribute('checked','checked');
		}

                lbl.appendChild(el);

		_make_break( parent );
        }

}


//      TODO: make this a proto function...
function _ontextchange( el, inst, cb_obj )
{
}

//      TODO: make this proto function...
function _on_tfclick(btn, tf, name, inst, cb_obj )
{
	var txt = tf.value;
        inst.tfclick(cb_obj, name, txt);
}



//      TODO: make this a proto function...
function _make_text(inst, parent, cb_obj, name, editable, label, defval)
{
	var id = 'inptxt_' + name;

        // make text field...
        var el = document.createElement("input")
        el.setAttribute('type', 'text' );

        // id...
        el.setAttribute('id', id );
	
	// editable...
	if (editable=="no")
	{
		el.setAttribute('readOnly','true');
		el.setAttribute('disabled','true');
	}

	// default...
	if ( defval!=null )
	{
		el.setAttribute('value',defval);
	}

        parent.appendChild(el);

	//
	// the button for the text box to submit...
	//
        var btn = document.createElement('button');

        //      create,set an id...
        id = 'btn_' + id;
        btn.setAttribute('id', id);

        //      create,set main style...
        var btn_style = "border: 1px black solid; background-color: white; color: black;";
        btn.setAttribute('style', btn_style);

        //      click event...
        btn.onclick =  function(){ _on_tfclick(btn, el, name, inst, cb_obj) };

        //      events attributes...
        btn.setAttribute('onMouseOver',"_on_over(this,'');");
        btn.setAttribute('onMouseOut',"_on_out(this,'');");

        //      set button title...
        btn.innerHTML = label;

        //      add to parent...
        parent.appendChild(btn);

}

//      TODO: make this proto function...
function _on_pageclick(btn, inst, name, cb_obj, target, value, button_width )
{
        // so, clicking both returns a value to the server AND goes to the target page

	// figure out the current button title...
	var cur_title = btn.innerHTML;	

        // use 'value' instead of name as a result value, if it's there.
        var name_or_value = cur_title;
        if (value)
	    if (value.length > 0) 
	        name_or_value = value;

	// return to server
	// inst.click(cb_obj, name_or_value, cur_title);
	inst.click(cb_obj, name, name_or_value);

	// change target page
	inst.pgclick( cb_obj, target );

}

//	TODO: make this a proto function...
function _make_btn(inst, parent, name, title, cb_obj, toggle, target, value, button_width )
{
        //      create buttons as needed...
        var btn = document.createElement('button');

	//	create,set an id...
	//var name = 'btn_' + title;
	btn.setAttribute('id', name);

	//	click event...	
	if ( target==null )
	{
	    btn.onclick =  function(){ _onclick(btn, inst, name, cb_obj, title, toggle, value, button_width) };
	}
	else
	{
	    btn.onclick =  function(){ _on_pageclick(btn, inst, name, cb_obj, target, value, button_width) };
	}

	//	create,set main style...
	var width_string = "";
	if (button_width != null) {
	    width_string = "width:" + button_width + ";";
	}
	var btn_style = "border: 1px black solid; background-color: white; color: black;" + width_string;
	btn.setAttribute('style', btn_style);

	//	events attributes...
	btn.setAttribute('onMouseOver','_on_over(this,"'+toggle+'");');
	btn.setAttribute('onMouseOut','_on_out(this,"'+toggle+'");');

	//	set button title...
	btn.innerHTML = title;

	//	add to parent...
        parent.appendChild(btn);

}


//      TODO: make this a proto function...
function _make_img(parent, path, width)
{
        //      create buttons as needed...
        var img = document.createElement('img');

        img.src = path;
	img.width = Number(width);

        parent.appendChild(img);

}
//	TODO: make proto function...
function _make_break(parent)
{
	var br = document.createElement('br');

	parent.appendChild(br);
}

//
//      Print:  Print the state of the object...
//
SVControl.prototype.Init = function()
{
	var div_name = this['div_control'];
	var parent = document.getElementById(div_name);

	var button_width = this['button_width'];

	//	possibly place header logo...
	var logo = this['logo'];
	var logovis = this['logovis'];
	if ( ( logo != null ) && ( logovis != 'off' ) )
	{
		var width = parent.width;

		_make_img( parent,logo,width );
	
		// add break after...
		_make_break( parent );
	}

	//	add buttons...
	var buttons = this['buttons'];
	if (buttons!=null)
	{
	for ( var i=0;i<buttons.length;i++)
	{
		var button = buttons[i];
		
		var name = button.name;

		var title = button.name;

		var toggle = button.toggle_name;

		var cb_obj = this['cb_obj'];

		var target = button.target_page;

		var value = button.value;

		_make_btn( this, parent, name, title, cb_obj, toggle, target, value, button_width );

		_make_break( parent );
	}
	}

	//	add dropdown...
	var dropdown = this['drop_down'];
	if (dropdown!=null)
	{
		_make_select( this, parent, dropdown['name'], cb_obj, dropdown['items'] );	
			
		_make_break( parent );
	}

        //      add text field...
        var tf = this['text_field'];
        if (tf!=null)
        {
		var cb_obj = this['cb_obj'];

                _make_text( this, parent, cb_obj, tf['name'], true, tf['label'], tf['default'] );
                        
		_make_break( parent );
        }

	//	add radio...
	var rb = this['radio_buttons'];
	if (rb!=null)
	{
		_make_radio( this, parent, cb_obj, rb['name'], rb['items'] );	
	}
}

