Table bookings widget loader
========

Here it comes.

It should be easy to add just place this code before the &lt;/body&rt; tag and it should add the button and make the thing work.


	<script type="text/javascript">
	    var _lopts = _lopts || [];
	        _lopts.domain = 'http://localhost';

	    (function() {
	        var loader = document.createElement('script'); loader.type = 'text/javascript'; loader.async = true;
	        loader.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'loader.js';
	        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(loader, s);
	    })();
	</script>
