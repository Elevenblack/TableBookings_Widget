// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012 James Frasca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


/*
A self-contained modal library
*/


(function() {
  window.picoModal = (function(window, document) {
    "use strict";
    var cssNumber, make, observable, overlay;
    cssNumber = {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    };
    observable = function() {
      var callbacks;
      callbacks = [];
      return {
        watch: function(callback) {
          callbacks.push(callback);
        },
        trigger: function() {
          var i;
          i = 0;
          while (i < callbacks.length) {
            window.setTimeout(callbacks[i], 1);
            i++;
          }
        }
      };
    };
    make = function(parent) {
      var elem, iface;
      elem = document.createElement("div");
      (parent || document.body).appendChild(elem);
      iface = {
        elem: elem,
        child: function() {
          return make(elem);
        },
        stylize: function(styles) {
          var prop, type;
          styles = styles || {};
          if (typeof styles.opacity !== "undefined") {
            styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")";
          }
          for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
              type = typeof styles[prop];
              if (type === "number" && !cssNumber[prop]) {
                styles[prop] += "px";
              }
              elem.style[prop] = styles[prop];
            }
          }
          return iface;
        },
        clazz: function(clazz) {
          elem.className += clazz;
          return iface;
        },
        html: function(content) {
          elem.innerHTML = content;
          return iface;
        },
        getWidth: function() {
          return elem.clientWidth;
        },
        onClick: function(callback) {
          if (elem.attachEvent) {
            elem.attachEvent("onclick", callback);
          } else {
            elem.addEventListener("click", callback);
          }
          return iface;
        },
        destroy: function() {
          document.body.removeChild(elem);
          return iface;
        }
      };
      return iface;
    };
    overlay = function(getOption) {
      var clickCallbacks, elem;
      clickCallbacks = observable();
      elem = make().clazz("pico-overlay").stylize({
        display: "block",
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 10000
      }).stylize(getOption("overlayStyles", {
        opacity: 0.5,
        background: "#000"
      })).onClick(clickCallbacks.trigger);
      return {
        elem: elem.elem,
        destroy: elem.destroy,
        onClick: clickCallbacks.watch
      };
    };
    return function(options) {
      var close, closeButton, closeCallbacks, elem, getOption, shadow, width;
      getOption = function(opt, defaultValue) {
        if (options[opt] === void 0) {
          return defaultValue;
        } else {
          return options[opt];
        }
      };
      if (typeof options === "string") {
        options = {
          content: options
        };
      }
      shadow = overlay(getOption);
      closeCallbacks = observable();
      elem = make().clazz("pico-content").stylize({
        display: "block",
        position: "fixed",
        zIndex: 10001,
        left: "50%",
        top: "50px"
      }).html(options.content);
      width = getOption("width", elem.getWidth());
      elem.stylize({
        width: width + "px",
        margin: "0 0 0 " + (-(width / 2) + "px")
      }).stylize(getOption("modalStyles", {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px"
      }));
      close = function() {
        closeCallbacks.trigger();
        shadow.destroy();
        elem.destroy();
      };
      if (getOption("overlayClose", true)) {
        shadow.onClick(close);
      }
      closeButton = void 0;
      if (getOption("closeButton", true)) {
        closeButton = elem.child().html(getOption("closeHtml", "&#xD7;")).clazz("pico-close").stylize(getOption("closeStyles", {
          borderRadius: "2px",
          cursor: "pointer",
          height: "15px",
          width: "15px",
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "16px",
          textAlign: "center",
          lineHeight: "15px",
          background: "#CCC"
        })).onClick(close);
      }
      return {
        modalElem: elem.elem,
        closeElem: (closeButton ? closeButton.elem : null),
        overlayElem: shadow.elem,
        close: close,
        onClose: closeCallbacks.watch
      };
    };
  })(window, document);

  /* --------------------------------------------
       Begin loader-code.coffee
  --------------------------------------------
  */


  /*
  Copyright (c) 2012 ElevenBlack
  Written by Ciocanel Razvan (chocksy.com)
  */


  /*
  A self-contained loader library
  */


  window.widgetLoader = (function(window, document) {
    "use strict";
    var $s, addSideButton, addWidget, addWidgetListeners, assignModal, cssNumber, defaults, elements, error, isMobile, loadModule, make, openModal, trace;
    defaults = {
      widget_domain: '//app.tablebookings.com/widgets/',
      widget_url: '',
      modal_width: false,
      modal_height: false,
      iframe_widget: false,
      iframe_width: "100%",
      iframe_height: "100%",
      side_btn: true
    };
    cssNumber = {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    };
    elements = {
      side_btn_content: '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Reservations Widget</a></div>',
      side_btn: "#WDG_sideBtn"
    };
    assignModal = function() {
      var _this = this;
      return $s('.tb-modal').on('click', function(e) {
        var element, moduleInfo, widget_token;
        e.preventDefault();
        console.log(e.currentTarget);
        element = e.currentTarget;
        widget_token = element.getAttribute('data-widget');
        console.log(widget_token);
        moduleInfo = JSON.stringify({
          url: widget_token
        });
        return loadModule({
          data: moduleInfo
        });
      });
    };
    loadModule = function(e) {
      var info_received;
      info_received = JSON.parse(e.data);
      window.TBopts.widget_url = info_received.url;
      if (isMobile()) {
        return window.open(window.TBopts.widget_domain + window.TBopts.widget_url, '_blank');
      } else {
        return openModal();
      }
    };
    openModal = function() {
      var current_height, current_width, outerHeight, outerWidth, widget_height, widget_width;
      current_height = make().getWindow('height');
      current_width = make().getWindow('width');
      widget_width = window.TBopts.modal_width ? window.TBopts.modal_width : current_width / 1.2;
      widget_height = window.TBopts.modal_height ? window.TBopts.modal_height : current_height / 1.6;
      outerWidth = typeof widget_width === "number" ? current_width - widget_width : current_width * parseInt(widget_width) / 100;
      outerHeight = typeof widget_height === "number" ? current_height - widget_height : current_height * parseInt(widget_height) / 100;
      return picoModal({
        content: '<iframe id="WDG_widgetIframe" src="' + window.TBopts.widget_domain + window.TBopts.widget_url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>',
        modalStyles: {
          width: widget_width,
          height: widget_height,
          top: "20%",
          background: "#fff",
          boxShadow: "0px 0px 7px #444",
          border: "5px solid #444",
          marginLeft: -outerWidth / 2 + "px"
        }
      });
    };
    addSideButton = function() {
      var moduleInfo,
        _this = this;
      $s('body').append(elements.side_btn_content);
      moduleInfo = JSON.stringify({
        url: window.TBopts.widget_url
      });
      $s(elements.side_btn).stylize({
        position: "fixed",
        top: "20%",
        left: "0",
        width: "50px",
        height: "157px",
        background: "url(//d1u2f2r665j4oh.cloudfront.net/side_button.png)",
        textIndent: "-9999px",
        boxShadow: "2px 1px 4px #ccc",
        borderRadius: "5px"
      });
      $s(elements.side_btn).on("click", function(event) {
        loadModule({
          data: moduleInfo
        });
        return event.preventDefault();
      });
      return false;
    };
    addWidget = function() {
      var $el, url, widget_iframe_html;
      url = window.TBopts.widget_domain + window.TBopts.widget_url + ("?theme=" + window.TBopts.theme);
      widget_iframe_html = '<iframe id="iframe_widget" src="' + url + '" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>';
      $el = $s(window.TBopts.widget_container);
      return $el.html(widget_iframe_html);
    };
    isMobile = function() {
      return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
    };
    $s = function(a, b) {
      var elem, fas;
      a = a.match(/^(\W)?(.*)/);
      elem = (b || document)["getElement" + (a[1] ? (a[1] === "#" ? "ById" : "sByClassName") : "sByTagName")](a[2]);
      fas = {
        elem: elem,
        data: function(dataAttr) {
          return elem.getAttribute("data-" + dataAttr);
        },
        html: function(content) {
          elem.innerHTML = content;
          return fas;
        },
        stylize: function(styles) {
          var prop, type;
          styles = styles || {};
          if (typeof styles.opacity !== "undefined") {
            styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")";
          }
          for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
              type = typeof styles[prop];
              if (type === "number" && !cssNumber[prop]) {
                styles[prop] += "px";
              }
              elem.style[prop] = styles[prop];
            }
          }
          return fas;
        },
        append: function(html) {
          var c, el;
          c = document.createElement("p");
          c.innerHTML = html;
          el = elem;
          if (elem.length) {
            el = elem[0];
          }
          el.appendChild(c.firstChild);
          return fas;
        },
        destroy: function() {
          if (!!elem) {
            document.body.removeChild(elem);
          }
          return fas;
        },
        on: function(eventName, handler) {
          var el;
          el = elem;
          if (elem.length) {
            el = elem[0];
          }
          if (el) {
            if (el.addEventListener) {
              el.addEventListener(eventName, handler);
            } else {
              el.attachEvent("on" + eventName, function() {
                handler.call(elem);
              });
            }
          }
        }
      };
      return fas;
    };
    make = function() {
      var fas;
      fas = {
        extend: function(out) {
          var i, key, obj;
          out = out || {};
          i = 1;
          while (i < arguments.length) {
            obj = arguments[i];
            if (!obj) {
              continue;
            }
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object") {
                  extend(out[key], obj[key]);
                } else {
                  out[key] = obj[key];
                }
              }
            }
            i++;
          }
          return out;
        },
        getWindow: function(type) {
          var d, e, g, w, x, y;
          w = window;
          d = document;
          e = d.documentElement;
          g = d.getElementsByTagName('body')[0];
          x = w.innerWidth || e.clientWidth || g.clientWidth;
          y = w.innerHeight || e.clientHeight || g.clientHeight;
          if (type === 'width') {
            return x;
          }
          if (type === 'height') {
            return y;
          }
        }
      };
      return fas;
    };
    addWidgetListeners = function() {
      var eventMethod, eventer, messageEvent,
        _this = this;
      trace("adding listener for selecting the date for showing time");
      eventMethod = (window.addEventListener ? "addEventListener" : "attachEvent");
      eventer = window[eventMethod];
      messageEvent = (eventMethod === "attachEvent" ? "onmessage" : "message");
      return eventer(messageEvent, (function(e) {
        return loadModule(e);
      }), false);
    };
    trace = function(s) {
      if (window["console"] !== undefined) {
        return window.console.log("widgetLoader: " + s);
      }
    };
    error = function(s) {
      if (window["console"] !== undefined) {
        return window.console.error("widgetLoader: " + s);
      }
    };
    return function(options) {
      window.TBopts = make().extend({}, defaults, options);
      trace("constructor");
      if (window.TBopts.iframe_widget) {
        addWidget();
        addWidgetListeners();
      }
      if (window.TBopts.side_btn) {
        addSideButton();
      }
      assignModal();
      return false;
    };
  })(window, document);

  window.onload = function() {
    if (_lopts.widget_container === void 0) {
      _lopts.widget_container = 'body';
    }
    return widgetLoader(_lopts);
  };

}).call(this);
