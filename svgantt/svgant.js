//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVGant ( params )
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

	var parent = this['div_gantt'];

                        $("#" + parent).gantt({
                                source: [{
                                        name: "Sprint 0",
                                        desc: "Analysis",
                                        values: [{
                                                from: "/Date(1320192000000)/",
                                                to: "/Date(1322401600000)/",
                                                label: "Requirement Gathering",
                                                customClass: "ganttRed"
                                        }]
                                        }],
			        navigate: "scroll",
                                scale: "weeks",
                                maxScale: "months",
                                minScale: "days",
                                itemsPerPage: 10,
                                onItemClick: function(data) {
                                        alert("Item clicked - show some details");
                                },
                                onAddClick: function(dt, rowId) {
                                        alert("Empty space clicked - add an item!");
                                },
                                onRender: function() {
                                        if (window.console && typeof console.log === "function") {
                                                console.log("chart rendered");
                                        }
                                }
                        });
 

}

//
//	ShowPage: enable/disable this control based on page...
//
SVGant.prototype.ShowPage = function(pg)
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

SVGant.prototype.Reset = function()
{
	var div_name = this['div_gant'];
        var div = document.getElementById(div_name);

}

SVGant.prototype.AddItems = function(items, clear)
{
	var parent = this['div_gantt'];

	var source = items;

	$("#" + parent).gantt({
                               source: source } );
 
	/*
	$("#" + parent).gantt({
				source: [{
                                        name: "Sprint 0",
                                        desc: "Analysis",
                                        values: [{
                                                from: "/Date(1320192000000)/",
                                                to: "/Date(1322401600000)/",
                                                label: "Requirement Gathering",
                                                customClass: "ganttRed"
                                        }]
                                	},{
                                        name: " ",
                                        desc: "Scoping",
                                        values: [{
                                                from: "/Date(1322611200000)/",
                                                to: "/Date(1323302400000)/",
                                                label: "Scoping",
                                                customClass: "ganttRed"
                                        }]
                                	},{
                                        name: "Sprint 1",
                                        desc: "Development",
                                        values: [{
                                                from: "/Date(1323802400000)/",
                                                to: "/Date(1325685200000)/",
                                                label: "Development",
                                                customClass: "ganttGreen"
                                        }] }] });
	*/
}

