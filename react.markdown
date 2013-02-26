Reactionary
===========
  Reactionary is a library for building Reactive Templating systems. 

  Wat so meta.

  EndDash is built on top of Reactionary.


  Essentially, you provide a criteria to match an element, when an element
matches, it runs your function with the matched element.

some code-ish stuff.    

```
<div class="outerModel-">
  <div class="model-">
    <div class="variable-"></div>
    <div class="variable-" data-scope="../"></div>
  </div>
  <div class="data" data-if="things.empty">

  </div>
  <ul class="things-" data-switch="type">
    <li class="thing-" data-type="typeOne">herp I'm a</li>
    <li class="thing-" data-type="typeTwo">herp I'm a</li>
  </ul>
</div>
```

```

EndDash.reactTo('[data-view]', {
         
  parse: function(el) {
    this.state.view = $(el).attr("data-view")
  },

  init: function(el, data) {

  },

  change: function() {

  },

  close: function(el, data) {

  },

  end: function(el, data) {
    new this.viewClass({ model: data })
  }

})

EndDash.reactTo({
  reactIf: function(el) {
    return $(el).children().length == 0 && $(el).is('[class$="-"], [class*="- "]')
  },

  parse: function() {
    if($(el).attr("class")) {
      var classes = $(el).attr("class").split(/\s+/)
      classes.match()
      key = 
    }
  },

  init: function(el, data) {
    data.on(change, function() {

    }
  }

})

EndDash.reactTo({

  parse: function(el) {
    this.stopTraversing()
    _($(el)).each(i, el) {
      EndDash.parse()
    })
  },

  add: function(el, data) {

  },

  remove: function() {

  }
})

```
