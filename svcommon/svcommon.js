//
//	SVCOMMON
//


//
//	function to import a javascript library and then call a callback func
//	
function importJS(src, look_for, onload)
        {
           var s = document.createElement('script');
           s.setAttribute('type', 'text/javascript');
           s.setAttribute('src', src);

           if (onload) wait_for_script_load(look_for, onload);

           var head = document.getElementsByTagName('head')[0];

           if (head) {
                       head.appendChild(s);
                     }
                     else
                     {
                       document.body.appendChild(s);
                     }
         }

//
//	function to load of a javascript and then call a callback when done...
//
function wait_for_script_load(look_for, callback)
        {
           var interval = setInterval(function()
                {

                        if (eval("typeof " + look_for) != 'undefined')
                        {

                                clearInterval(interval);
                                callback();
                        }

                 }, 50);
         }

//
//	var function to determine if and version of IE...
//
var ie = ( function() {

	var undef,
		v=3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');

	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);

	return v > 4 ? v : undef;

}());

//
//	stuff to deal with lack of console in IE...
//
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 

