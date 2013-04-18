# Bookings widget loader

Super nice jQuery plugin to load the bookings widget.

## Installation

Include the jQuery library above your &lt;/body&gt; tag 

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

Then after adding the jQuery script add the following script below that:

  	<script type="text/javascript">
	    var _lopts = _lopts || [];
	        _lopts.widget_domain = "the widget location domain";
	        _lopts.widget_url    = "any other special parameters";

	    (function() {
	        var loader = document.createElement('script'); loader.type = 'text/javascript'; loader.async = true;
	        loader.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 's3-eu-west-1.amazonaws.com/epic-plugins/loader.js';
	        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(loader, s);
	    })();
	</script>   


## Configuration

### _lopts

You have to specify this "_lopts" array that holds the options to configure that plugin. We can also set these as defaults in the plugin so this won't be required.

### .widget_domain

The widget domain is the location of the widget.

	_lopts.widget_domain = "//localhost/"

### .widget_url

The widget url are the parameters that come after the domain if you have any for example ?id=333&do=match

	_lopts.widget_url = "?id=2"

### .iframe_widget

You can specify if you want the plugin to load in the page an iframe with the widget on load.

	_lopts.iframe_widget = false

### .side_btn

You can specify if you want to turn off the sidebar button that loads the widget

	_lopts.side_btn = true

### .widget_container

Give here the element you want the iframe widget to be inserted in if you don't specify it then it will be added to the body

	_lopts.widget_container = 'body' 

	//or 

	_lopts.widget_container = '#my_widget'

	//or

	_lopts.widget_container = '.widget'


## Made by: [Chocksy](http://github.com/Chocksy)
