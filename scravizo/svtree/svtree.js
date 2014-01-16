
//
//	Constructor...
//
function SVTree( params )
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

	//	The tree data structure (dictionary of dictionaries)...
	this._TREE = {};
	this._DATA = {};

	//	Possibly initialize the tree with path(s)...
	if ( this.hasOwnProperty('init_tree') )
	{
		this._datify( this['init_tree'] );
	}

	//	Start it...
	this._treeify(this);
}

SVTree.prototype.ShowPage = function(pg)
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

SVTree.prototype.AddPaths = function(paths, clear)
{
	if (clear) 
	{
		this._TREE = {};
		var parent = document.getElementById(this['div_tree']);
		while (parent.hasChildNodes()) 
		{
    			parent.removeChild(parent.lastChild);
		}
	}

	this._datify( paths );

	this._treeify( this );
}


//
//      _datify_one_path: Insert one path string into recursive data structure...
//
SVTree.prototype._datify_one_path = function(path)
{
        var dct = this._TREE;

        //      iterate nodes in path...
        for (var j=0;j<(path.length-1);j++)
        {
                key = path[j];
                if ( key in dct )
                {
                        // this node exists...
                        dct = dct[key];
                        continue;
                }
                else
                {
                        dct[key] = {}
                        dct = dct[key];
                }
        }

	//	hash the data...
	var data = path[ path.length - 1 ];
	var node = path[ path.length - 2 ];

	//alert(data);
	//alert(node);
	this._DATA[ node ] = data;
}

//
//      _datify: Insert all path strings into a recursive data structure...
//
SVTree.prototype._datify = function(paths)
{
        for (var i=0;i<paths.length;i++)
        {
		var path = paths[i];
                this._datify_one_path( path );
        }
}

//
//	_datify_ws: Get path strings from web service...
//
SVTree.prototype._datify_ws = function(wsurl)
{
	$.ajax({
			dataType: "text", 
			url : wsurl,
			async: false,
			success : function (my_data) { eval( my_data);  },
			error : function () { alert('An error occurred processing the web service.') }
		});
}

//
//	Event handler for click...
//
SVTree.prototype._click = function(path)
{
	//	get the click callback...
	f = this['click'];

	//	get the leaf node...
	var node = path[ path.length - 1];

	//	get the data assoc with this node...
	var data = this._DATA[ node ];

	//	get obj...
	var obj = this['cb_obj'];

	//	invoke the cb...
	f( this, path, data, obj );

}

//
//	_treeify: Create a tree in DOM...	
//
SVTree.prototype._treeify = function(obj)
{
	//	get the toplevel info...
        var dct = this._TREE;
        var parent = document.getElementById(this['div_tree']);
        var path = "";

	//	build the DOM recursively, as needed by jstree...
	this._recurse( dct, parent, path );


	var divname = "#" + this['div_tree'];

        $(function () {
                          $(divname)
                               .jstree({
                                        "themes" : {
                                                        "theme" : "classic",
                                                        "dots" : false,
                                                        "icons" : false
                                                   },
                                        "core" : {
                                                "initially_open":[]
                                                },
                                        "plugins" : ["core","themes","html_data","ui"] })

                                // 1) if using the UI plugin bind to select_node
                               .bind("select_node.jstree",
                                        function (event, data)
                                        {
	
                                                // `data.rslt.obj` is the jquery extended node that was clicked

                                                //      get the path of the node...
                                                var strid = data.rslt.obj.attr("id");
                                                var path = strid.split("_");

                                                //      invoke the click callback...
                                                obj._click(path);

                                        })

                                // 2) if not using the UI plugin - the Anchor tags work as expected
                                //    so if the anchor has a HREF attirbute - the page will be changed
                                //    you can actually prevent the default, etc (normal jquery usage)
                                .delegate("a", "click", function (event, data)
                                                        { event.preventDefault(); });

                                setTimeout(function () { $("#start_tree").jstree("close_all"); }, 1);



        });

}

//
//      _recurse: Create jstree nodes recursively...
//
SVTree.prototype._recurse = function(dct, parent, path)
{
        var d = document.createElement('div');
        d.id = "start_tree";
        parent.appendChild(d);

        var ul = document.createElement('ul');
        ul.id = "ul__" + path;
        parent.appendChild(ul)

        for (var key in dct)
        {
                var li = document.createElement('li');
                var strid = path + "_" + key;
                if (path=="")
                        strid = key;
                li.id = strid;
                li.className="jstree-open";
                ul.appendChild(li)

                var a = document.createElement('a');
                a.setAttribute('href','#');
                a.innerHTML = key;
                li.appendChild(a);

                var obj = dct[key];

                if ( Object.prototype.toString.call( obj ) == "[object Object]" )
                {
                        this._recurse( obj, li, strid );
                }
        }
}

