// Generated by CoffeeScript 1.6.1

/*
easyModal.js v1.0.0
A minimal jQuery modal that works with your CSS.
Author: Flavius Matis - http://flaviusmatis.github.com/
URL: https://github.com/flaviusmatis/easyModal.js
*/


(function() {

  (function($) {
    var methods;
    methods = {
      init: function(options) {
        var defaults;
        defaults = {
          top: "auto",
          autoOpen: false,
          overlayOpacity: 0.5,
          overlayColor: "#000",
          overlayClose: true,
          closeOnEscape: true,
          closeButtonClass: ".close",
          onOpen: false,
          onClose: false
        };
        options = $.extend(defaults, options);
        return this.each(function() {
          var $modal, $overlay, o;
          o = options;
          $overlay = $("<div class=\"lean-overlay\"></div>");
          $overlay.css({
            display: "none",
            position: "fixed",
            "z-index": 2000,
            top: 0,
            left: 0,
            height: 100 + "%",
            width: 100 + "%",
            background: o.overlayColor,
            opacity: o.overlayOpacity
          }).appendTo("body");
          $modal = $(this);
          $modal.css({
            display: "none",
            position: "fixed",
            "z-index": 2001,
            left: 50 + "%",
            borderRadius: "7px",
            top: (parseInt(o.top) > -1 ? o.top + "px" : 50 + "%"),
            "margin-left": -($modal.outerWidth() / 2) + "px",
            "margin-top": (parseInt(o.top) > -1 ? 0 : -($modal.outerHeight() / 2)) + "px"
          });
          $modal.bind("openModal", function(e) {
            $(this).css("display", "block");
            return $overlay.fadeIn(200, function() {
              if (o.onOpen && typeof o.onOpen === "function") {
                return o.onOpen($modal[0]);
              }
            });
          });
          $modal.bind("closeModal", function(e) {
            $(this).css("display", "none");
            return $overlay.fadeOut(200, function() {
              if (o.onClose && typeof o.onClose === "function") {
                return o.onClose($modal[0]);
              }
            });
          });
          $overlay.click(function() {
            if (o.overlayClose) {
              return $modal.trigger("closeModal");
            }
          });
          $(document).keydown(function(e) {
            if (o.closeOnEscape && e.keyCode === 27) {
              return $modal.trigger("closeModal");
            }
          });
          $modal.find(o.closeButtonClass).click(function(e) {
            $modal.trigger("closeModal");
            return e.preventDefault();
          });
          if (o.autoOpen) {
            return $modal.trigger("openModal");
          }
        });
      }
    };
    return $.fn.easyModal = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.easyModal");
      }
    };
  })(jQuery);

  /* --------------------------------------------
       Begin loader.coffee
  --------------------------------------------
  */


  (function($, window) {
    "use strict";
    var widgetIframeLoader;
    widgetIframeLoader = (function() {

      widgetIframeLoader.prototype.defaults = {
        widget_domain: '//localhost/',
        widget_url: '',
        iframe_widget: false,
        side_btn: true
      };

      widgetIframeLoader.prototype.elements = {
        side_btn_content: '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Reservations Widget</a></div>',
        popup_widget_content: '<div id="WDG_popWidget"></div>',
        side_btn: "#WDG_sideBtn",
        popup_widget: "#WDG_popWidget"
      };

      function widgetIframeLoader(el, options) {
        this.trace("constructor");
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(el);
        if (this.options.iframe_widget) {
          this.addWidget();
          this.addWidgetListeners();
        }
        if (this.options.side_btn) {
          this.addSideButton();
        }
      }

      widgetIframeLoader.prototype.isMobile = function() {
        return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
      };

      widgetIframeLoader.prototype.addWidget = function() {
        var url, widget_iframe_html;
        url = this.options.widget_domain + this.options.widget_url;
        widget_iframe_html = '<iframe id="iframe_widget" src="' + url + '" class="iframe-class" frameborder="0" allowtransparency="true"></iframe>';
        return this.$el.html(widget_iframe_html);
      };

      widgetIframeLoader.prototype.addSideButton = function() {
        var moduleInfo,
          _this = this;
        $('body').append(this.elements.side_btn_content);
        $(this.elements.side_btn).css({
          position: "fixed",
          top: "20%",
          left: "0",
          width: "50px",
          height: "157px",
          background: "url(https://s3-eu-west-1.amazonaws.com/epic-plugins/side_button.png)",
          textIndent: "-9999px",
          boxShadow: "2px 1px 4px #ccc",
          borderRadius: "5px"
        });
        moduleInfo = JSON.stringify({
          url: this.options.widget_url
        });
        return $(this.elements.side_btn).on("click", function() {
          return _this.loadModule({
            data: moduleInfo
          });
        });
      };

      widgetIframeLoader.prototype.addWidgetListeners = function() {
        var eventMethod, eventer, messageEvent,
          _this = this;
        this.trace("adding listener for selecting the date for showing time");
        eventMethod = (window.addEventListener ? "addEventListener" : "attachEvent");
        eventer = window[eventMethod];
        messageEvent = (eventMethod === "attachEvent" ? "onmessage" : "message");
        return eventer(messageEvent, (function(e) {
          return _this.loadModule(e);
        }), false);
      };

      widgetIframeLoader.prototype.openModal = function() {
        var current_height, current_width, widget_height, widget_width;
        current_height = $(window).height();
        current_width = $(window).width();
        widget_width = current_width / 1.2;
        widget_height = current_height / 1.6;
        $(this.elements.popup_widget).remove();
        $('body').append(this.elements.popup_widget_content);
        $(this.elements.popup_widget).css({
          width: widget_width,
          height: widget_height,
          top: "20%",
          background: "#fff",
          boxShadow: "0px 0px 7px #444",
          border: "5px solid #444"
        });
        $(this.elements.popup_widget).easyModal({
          top: "20%",
          overlayOpacity: 0.3,
          overlayColor: "#333",
          overlayClose: true,
          closeOnEscape: false
        });
        $(this.elements.popup_widget).append('<iframe id="WDG_widgetIframe" src="' + this.options.widget_domain + this.options.widget_url + '" class="iframe-class" frameborder="0" allowtransparency="true"></iframe>');
        $('#WDG_widgetIframe').css({
          width: widget_width,
          height: widget_height,
          borderRadius: "7px"
        });
        return $(this.elements.popup_widget).trigger('openModal');
      };

      widgetIframeLoader.prototype.loadModule = function(e) {
        var info_received;
        info_received = JSON.parse(e.data);
        this.options.widget_url = info_received.url;
        if (this.isMobile()) {
          return window.open(this.options.widget_domain + this.options.widget_url, '_blank');
        } else {
          return this.openModal();
        }
      };

      widgetIframeLoader.prototype.trace = function(s) {
        if (window["console"] !== undefined) {
          return window.console.log("widgetLoader: " + s);
        }
      };

      widgetIframeLoader.prototype.error = function(s) {
        if (window["console"] !== undefined) {
          return window.console.error("widgetLoader: " + s);
        }
      };

      return widgetIframeLoader;

    })();
    return $.fn.extend({
      widgetIframeLoader: function(option, args) {
        return this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data('widgetIframeLoader');
          if (!data) {
            $this.data('widgetIframeLoader', (data = new widgetIframeLoader(this, option)));
          }
          if (typeof option === 'string') {
            return data[option].apply(data, args);
          }
        });
      }
    });
  })(window.jQuery, window);

  window.onload = function() {
    if (_lopts.widget_container === void 0) {
      _lopts.widget_container = 'body';
    }
    return $(_lopts.widget_container).widgetIframeLoader(_lopts);
  };

}).call(this);
