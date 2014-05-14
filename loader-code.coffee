#@codekit-prepend "picoModal"
window.widgetLoader = ((window,document) ->
  "use strict"

  defaults=
    widget_domain:  '//app.tablebookings.com/widgets/'
    widget_url:     ''
    modal_width:    false
    modal_height:   false
    iframe_widget:  false
    iframe_width:   "100%"
    iframe_height:  "100%"
    side_btn:       true 
  
  cssNumber=
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

  elements= 
    side_btn_content:     '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Reservations Widget</a></div>'
    popup_widget_content: '<div id="WDG_popWidget"></div>'
    side_btn:             "#WDG_sideBtn"
    popup_widget:         "#WDG_popWidget"

  # ---- assignModal Method
  # -- assign modal method to element class
  assignModal= ->
    $s('.tb-modal').on 'click',(e)=>
      e.preventDefault()
      console.log e.currentTarget
      element = e.currentTarget #$s(e.currentTarget)
      widget_token = element.getAttribute('data-widget')
      console.log widget_token
      moduleInfo = JSON.stringify({url:widget_token})
      loadModule({data:moduleInfo})

  # ---- loadModule Method
  # -- we use this method as a way to verify if we need to open a new window or a modal
  # -- depending by the browser type. This is also called by the iframe in case of displaying
  # -- a new step.
  loadModule= (e)->
    info_received = JSON.parse(e.data)
    window.options.widget_url = info_received.url

    if isMobile()
      window.open(window.options.widget_domain+window.options.widget_url,'_blank')
    else
      openModal()
  
  # ---- openModal Method
  # -- we use this method to initialize the modal and add the iframe to it
  openModal= ()->
    current_height = make().getWindow('height')
    current_width = make().getWindow('width')
    widget_width = if window.options.modal_width then window.options.modal_width else current_width/1.2
    widget_height = if window.options.modal_height then window.options.modal_height else current_height/1.6

    outerWidth = if typeof widget_width=="number" then current_width-widget_width else (current_width*parseInt(widget_width)/100)
    outerHeight= if typeof widget_height=="number" then current_height-widget_height else (current_height*parseInt(widget_height)/100)
    
    picoModal(
      content: '<iframe id="WDG_widgetIframe" src="'+ window.options.widget_domain+window.options.widget_url+'" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>'
      modalStyles: 
        width: widget_width
        height: widget_height
        top: "20%"
        background: "#fff"
        boxShadow: "0px 0px 7px #444"
        border: "5px solid #444"
        marginLeft: -outerWidth/2+"px"
    )
    
    
  # ---- isMobile Method
  # -- check if the browser is a mobile browser
  isMobile= ->
    /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())

  $s = (a, b) ->
    console.log a
    a = a.match(/^(\W)?(.*)/)
    elem = (b or document)["getElement" + ((if a[1] then (if a[1] is "#" then "ById" else "sByClassName") else "sByTagName"))] a[2]
    trace "$ #{elem}"
    fas = 
      elem: elem
      data : (dataAttr) ->
        elem.getAttribute("data-"+dataAttr)

      # Sets the HTML
      html: (content) ->
        elem.innerHTML = content
        fas

      # Applies a set of styles to an element
      stylize: (styles)->
        styles = styles or {}
        styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")"  if typeof styles.opacity isnt "undefined"
        for prop of styles
          if styles.hasOwnProperty(prop)
            type = typeof styles[prop]
            if type=="number" and !cssNumber[prop]
              styles[prop] += "px"
            elem.style[prop] = styles[prop] 
        fas

      append : (html)->
        c = document.createElement("p")
        c.innerHTML = html
        elem[0].appendChild c.firstChild
        fas
        
      # Removes this element from the DOM
      destroy: ->
        document.body.removeChild elem unless !elem
        fas
      on   : (eventName,handler)->
        el = elem[0]
        if el.addEventListener
          el.addEventListener eventName, handler
        else
          el.attachEvent "on" + eventName, ->
            handler.call elem
            return

        return
    fas
  make = ()->
    fas = 
      extend : (out) ->
        out = out or {}
        i = 1

        while i < arguments.length
          obj = arguments[i]
          continue  unless obj
          for key of obj
            if obj.hasOwnProperty(key)
              if typeof obj[key] is "object"
                extend out[key], obj[key]
              else
                out[key] = obj[key]
          i++
        out

      # fixSize

      getWindow: (type)->
        w = window
        d = document
        e = d.documentElement
        g = d.getElementsByTagName('body')[0]
        x = w.innerWidth || e.clientWidth || g.clientWidth
        y = w.innerHeight|| e.clientHeight|| g.clientHeight
        return x if type=='width'
        return y if type=='height'
    fas

  addEventListener = (el, eventName, handler) ->
    if el.addEventListener
      el.addEventListener eventName, handler
    else
      el.attachEvent "on" + eventName, ->
        handler.call el
        return

    return
    
  trace = (s) ->
    window.console.log "widgetLoader: " + s  if window["console"] isnt `undefined`
  error = (s) ->
    window.console.error "widgetLoader: " + s  if window["console"] isnt `undefined`
  # A function for easily displaying a modal with the given content
  (options) ->
    # getOption = (opt, defaultValue) ->
    #   (if options[opt] is undefined then defaultValue else options[opt])
    console.log options
    window.options = make().extend({}, defaults,options)
    trace "constructor"
    $el = $s(window.options.widget_container)
    if window.options.iframe_widget
      addWidget()
      addWidgetListeners()
    if window.options.side_btn
      addSideButton()
    assignModal()
    console.log window.options
    # alert('da')

)(window,document)


window.onload = ()->
  if _lopts.widget_container is undefined
    _lopts.widget_container = 'body'
  widgetLoader(_lopts)

