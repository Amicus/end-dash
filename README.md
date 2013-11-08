EndDash
=======

EndDash is a bindings-aware client-side templating language built on top of valid HTML.

[Getting started](#getting-started)
[Templating from models](#templating-from-models)
[Building and testing](#building-and-testing)
[Play with examples](#play-with-examples)


## Getting started

Include the library and dependencies:
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="http://backbonejs.org/backbone.js"></script>
<script src="/scripts/end-dash.js"></script>
```

## Templating from models

Define your templates:
```html
<script type="text/enddash" name="character">
  <div class="user">
    <p>
      Hello, my name is <span class="firstName-"></span>
      <span class="lastName-"></span>...
    </p>

    <strong class="quip-"></strong>
  </div>
</script>
```


Bind templates to models in your application code:
```javascript
$.ready(function() {
  // Load all the templates on the page.
  EndDash.bootstrap();

  var tony = new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    quip: "You know, the question I get asked most often is, 'Tony, how do you go to the bathroom in your suit?'"
  });

  var template = EndDash.getTemplate('character', tony);

  $('#content').html(template.el);
});
```

If your model changes, the DOM updates!

## Building and testing

```bash
npm install

# We use grunt for running tasks.
npm install -g grunt-cli

# Build end-dash in build/ directory
grunt build # also aliased as `grunt`

# Run tests
grunt test

# Watch for changes and run tests
grunt watch
```

## Play with examples

If you clone this repo and install grunt as described above
you can play with some end-dash examples in your browser.
Just type `grunt` in the root directory to build the current
version of end-dash into the build directory, and then
open up any of the example html files in the examples directory
in your browser (`open examples/looping.html` for example works
on OS X), and you can edit the templates or models directly in the
html file if you want to experiment.


