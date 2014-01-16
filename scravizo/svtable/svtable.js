//
//	Config parameters for this library...
//

//
//	Constructor...
//
function SVTable( params )
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
	var divname = this['div_table'];

	//	create a unique name...
	var name = divname + "_datatable";


	//	create a columns dct...
	var cols = [];
	for ( var i=0;i< this['columns'].length;i++)
	{
		var c = this['columns'][i]['header'];
		cols[i] = { 'sTitle':c };
	}

	//	compute the ysize of the scroll area
	//	TODO: need to compute the header and footer areas...
	var parent = document.getElementById( divname );
	var scrollY = Number( parent.offsetHeight ) - 22 - 25 - 22 - 3;
	
	//	create the jquery datatable...
	var initstr = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + name + '" ></table>'; 
        $(document).ready(function() {
                                $('#'+divname).html( initstr );
                                $( '#' + name ).dataTable( {
                                        "sPaginationType":"two_button",
                                        "aaData": [],
                                        "aoColumns": cols,
					"sScrollX":"100%",
					"sScrollY":scrollY,
					"bFilter":false
                                                } );
                        } );
      
	this.num_rows = 0; 
}

SVTable.prototype._AddStyleSheets = function()
{
	var sheet = document.createElement('style')
	sheet.innerHTML = "div {border: 2px solid black; background-color: blue;}";
	document.body.appendChild(sheet);
}

SVTable.prototype.ShowPage = function(pg)
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

SVTable.prototype.Reset = function()
{
}

SVTable.prototype.AddData = function(data, clear)
{
	var name = '#' + this['div_table'] + "_datatable";
	
	if (clear)
	{
		$( name ).dataTable().fnClearTable();
	}

	for (var i=0;i<data.length;i++)
	{
		var d = data[i];
		var r = Number(d['row']);
		var c = Number(d['column']);
		var val = d['value'];

		//	do we need to insert blank rows ?
		if ( r>= this.num_rows )
		{	
			//	insert empty rows...
			for ( var k=0;k< ( r-this.num_rows+1);k++)
			{	
				//	create an empty row...
				var row = [];
				for ( var m=0;m< this['columns'].length;m++) row[m] = '';
				
				//	append it...
				$( name ).dataTable().fnAddData( row );
			
			}

			//	update num rows...
			this.num_rows = r + 1;
		}

		//	now, insert new values...
		$( name ).dataTable().fnUpdate( val, r, c, false, false );

	}

}


