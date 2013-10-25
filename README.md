End Dash is a bindings-aware client-side templating language built on top of valid HTML.

## Getting started

Include the library and dependencies:
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="http://backbonejs.org/backbone.js"></script>
<script src="/scripts/end-dash.js"></script>
```

Define your templates:
```html
<script type="text/enddash" name="user">
  <div class="user">
    <p>
      Hello, my name is <span class="firstName-"></span>
      <span class="lastName-"></span>! I have something to tell you...
    </p>

    <strong class="catchphrase-"></strong>
  </div>
</script>
```

Bind templates to models in your application code:
```javascript
$.ready(function() {
  // Load all the templates on the page.
  EndDash.bootstrap();

  var michael = new Backbone.Model({
    firstName: 'Michael',
    lastName: 'Jackson',
    catchphrase: "You've been hit and struck by a smooth criminal!"
  });

  var template = EndDash.getTemplate('user', michael);

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
