End Dash is a bindings-aware client-side templating language built on top of valid HTML.

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
Note: We are in the process of changing the syntax of EndDash to support
text interpolation without a span or div element as shown above.  This is working
in the branch `interpolated-variables` and `interpolated-variables-inputs`
but we're still in the process of adding tests and deciding whether to handle
deprecating the old syntax with warnings, or dropping it entirely.
If evaluating EndDash please consider using one of these branches until it's
merged into master if you prefer `#{attribute}` to `<span class="attribute-"></span>`


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
