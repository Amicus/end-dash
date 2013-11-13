
EndDash
=======

EndDash is a bindings-aware client-side templating framework built on top of valid HTML.

In its current release, EndDash relies on Backbone objects. See
[the dependency section](#dependencies) for further details.

([Documentation](#documentation) is below)

## Getting Started

Install EndDash and install grunt helper

```bash
npm install

# We use grunt for running tasks.
npm install -g grunt-cli

# Build end-dash in build/ directory
grunt build # also aliased as `grunt`
```

Include the library and dependencies.

```html
<!-- Make sure you include these libraries before EndDash -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="http://backbonejs.org/backbone.js"></script>

<script src="/end-dash/build/end-dash.js"></script>
```

Define your templates.

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

WARNING: A template can only have one root element. In the above case, it is the div with class 'user'.

Load your templates into EndDash.

```javascript
$.ready(function() {
  // Load all the templates on the page.
  EndDash.bootstrap();
)};
```

Bind your templates to models in your application code.

```javascript
  var tony = new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    quip: "You know, the question I get asked most often is, 'Tony, how do you go to the bathroom in your suit?'"
  });

  var template = EndDash.getTemplate('character', tony);

  $('#content').html(template.el);
});
```

If your models changes, the DOM will update to reflect the changes.

## Ready Made Examples

If you clone this repo and install grunt as described above
you can play with some end-dash examples in your browser.
Just type `grunt` in the root directory to build the current
version of end-dash into the build directory, and then
open up any of the example html files in the examples directory
in your browser (`open examples/looping.html` for example works
on OS X), and you can edit the templates or models directly in the
html file if you want to experiment.

Documentation
=============
[Using Model Attributes](#using-model-attributes)
  * [Variables](#variables)
  * [Attribute Interpolation](#attribute-interpolation)

[Inputs](#inputs)
  * [Text Inputs](#text-inputs)
  * [Radio Buttons](#radio-buttons)
  * [Checkboxes](#checkboxes)

[Looping](#looping)
  * [Simple Looping](#simple-looping)
  * [Polymorphic Attributes](#polymorphic-attributes)
  * [Collection Attributes](#collection-attributes)

[Conditionals](#conditionals)

[Scoping](#scoping)
  * [What is scoping?](#what-is-scoping)
  * [Scoping Down with a Dash](#scoping-down-with-a-dash)
  * [Scoping With Paths](#scoping-with-paths)

[View Integration](#view-integration)

[Templates](#templates)

[Partials](#partials)

[Debugger](#debugger)



Using Model Attributes
======================

## Variables

EndDash variables are rendered into the body of HTML elements, displaying their values as ordinary text:

```html
<div class="user-">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```

## Attibute Interpolation

Model properties can also be interpolated into any html tag attribute.

```html
<a href='/person/#{firstName}'> Home Page </a>
```

```javascript
template.bind(new Backbone.Model({firstName: 'Derrick'}));
```

Resulting Tag:

```html
<a href='/person/Derrick'> Home Page </a>
```

Inputs
======

EndDash does two-way binding between model attributes and input elements.

## Text Inputs

Text inputs are bound to a referenced attribute on the model in scope.
To create this binding, add the attribute name with a dash at the end as a classname
in the template.

```html
<p>
  What is your name?
  <input  type="text" class="name-">
</p>
```

## Radio buttons

Radio buttons bind the selected button's value to the model's referenced attribute.

```html
<div>
  <p>Who is your favorite character?</p>
  <input type="radio" class="name-" name="name-" value="tony" id="tony"/>
  <label for="tony">Tony</label>
  <input type="radio" class="name-" name="name-" value="pepper" id="pepper"/>
  <label for="pepper">Pepper</label>
  <input type="radio" class="name-" name="name-" value="james" id="james"/>
  <label for="james">James</label>
</div>
```

## Checkboxes

Checkboxes are trickier. When unchecked, the referenced attribute on the model will
be 'false'. When checked, the referenced model's attribute will be set to
the attribute value on the input element (or 'true' if no value is defined).

```html
<p>Do you want to receive notifications about Iron Man?</p>
<input type="checkbox" name="notifyList" class="notify-" />
```

Looping
===========

##Simple Looping

EndDash lets you loop through objects in a collection.

```javascript
var characters = new Backbone.Collection([
  new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    role: 'hero'
  }),

  new Backbone.Model({
    firstName: 'Pepper',
    lastName: 'Potts',
    role: 'civilian'
  }),

  new Backbone.Model({
    firstName: 'Iron',
    lastName: 'Monger',
    role: 'villain'
  }),

  new Backbone.Model({
    firstName: 'James',
    lastName: 'Rhodes',
    role: 'hero'
  })
]);
```

```html
<div class="characters-">
  <div data-each>
    <div class="firstName-"></div>
  </div>
</div>
```

## Polymorphic attributes

If your objects have an enum field, you can branch based on its value.

For example, `role` behaves as a polymorphic attribute:

```html
<div class="rolePolymorphic-" data-each>
  <div class="whenHero-">
    <span class="firstName-"></span> says:
    Don't worry. I'll probably save you.
  </div>

  <div class="whenVillain-">
    <span class="firstName-"></span> says:
    Worry.
  </div>

  <div class="whenCivilian-">
    <span class="firstName-"></span> says:
    Get me outta here!
  </div>
</div>
```

Given the following objects:

```js
new Backbone.Collection([
  new Backbone.Model({firstName: 'Tony', role: 'hero'}),
  new Backbone.Model({firstName: 'Piper', role: 'civilian'}),
  new Backbone.Model({firstName: 'Iron', role: 'villain'}),
  new Backbone.Model({firstName: 'James', role: 'hero'})
]);
```

The template would produce the following HTML:

```html
<div class="rolePolymorphic-" data-each>
  <div class="whenHero-">
    <span class="firstName-">Tony</span> says:
    Don't worry.  I'll probably save you.
  </div>

  <div class="whenCivilian-">
    <span class="firstName-">Piper</span> says:
    Get me outta here!
  </div>

  <div class="whenVillain-">
    <span class="firstName-">Iron</span> says:
    Worry.
  </div>

  <div class="whenHero-">
    <span class="firstName-">James</span> says:
    Don't worry.  I'll probably save you.
  </div>
</div>
```

To add a default case, include a non-EndDash child div:

```html
<div class="rolePolymorphic-">
  <div class="whenHero-">
    <span class="firstName-"></span> says:
    Don't worry.  I'll probably save you.
  </div>

  <!-- Default case! The following gets rendered unless
       model.get('role') === 'hero'. -->
  <div>
    <span class="firstName-"></span> says:
    I've lost my memory.  I don't know who I am!
  </div>
</div>
```

## Collection Attributes

*Please note:* Backbone.Collection does *not* support attributes natively for its collections,
but there are a number of options for extending collections to do so.  EndDash supports
collection attributes as long as they are implemented according to Backbone.Model API, via
the `get` method (which Backbone.Collection natively uses only for getting a model by id,
not an attribute by name).  Typically collection attributes are used for metadata about
the collection, such as total size (if the collection is paginated and this is
different than length), as in the example below:

```html
<div class="authorizedPeople-" >
  <p>
    There are <span class="totalCount-"></span> people allowed in Tony's basement.
  </p>
</div>
```

Conditionals
============

A ternary operator is available for presence handling via 'truthiness' for attributes
that may be present, with or without a false condition:

```html
<div class="user- #{availability ? available : unavailable}">
  <p>
    My schedule is very full. <span class="isAvailable-">I just have a few openings</span>
  </p>
</div>
```

The same truthiness controls conditional visibility EndDash class elements that start with `is` or `has`,
and their boolean opposites `isNot` and `hasNot`, as above with `isAvailable-`.  EndDash will hide (via a
`display:none` style attribute) any such element when its named attribute is falsy (or hide when truthy in
the case of `isNot` and `hasNot`.)

```javascript
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    alias: 'IronMan'
    availability: ['10am', '2pm']
  });
});
```

Scoping
=======

## What is Scoping?

Scope in EndDash refers to the model on the top of the EndDash stack.
Each template and partial is given its own scope. The 'root' scope is always the object passed
to EndDash's 'bind' or 'getTemplate' function.

```javascript
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    hobby: {
      description: 'Building all the cool technology'
    }
  })
});
```

The root object is the object literal with the property 'user'.

Scope can change in two ways:

## Scoping Down With A Dash

```html
<div class='user-'>
  //Internal HTML
</div>
```

Scopes into the Backbone Model with properties: 'firstName', 'lastName', and 'hobby'.
This syntax only allows scopping down.

## Scoping With Paths
(UNIX style)

```html
<div class='user-'>
  <div data-scope='/'>
    //Iternal HTML
  </div>
</div>
```

Scopes down into the user object and then, via the data-scope property, scopes back to the root object
(the object literal with propery 'user').

Normal UNIX path shorthands apply: `..` to move back up a scope level, `/` to seperate scope levels,
`.` for the current scope.

```html
<div class='user-'>
  //User scope
  <div class='hobby-'>
  //Hobby scope
    <div data-scope='../'>
    //Back in User Scope
      <div data-scope='/user/hobby'>
      //Back in Hobby scope
      </div>
    </div>
  </div>
</div>
```

`class='user-'` is actually syntatic sugar for `data-scope='./user'`.  Using `data-scope` like this,
at the current scope, is mainly useful for accessing a property of a nested model in the same DOM
element that you change the scope.

View Integration
================

EndDash provides dynamic behavior often otherwise handled by views in Backbone.
If more specific dynamic behavior is required, take advantadge of EndDash's hooks to Backbone Views. Simply add
the html attribute `data-view` with the value of your viewName, to the template.

```html
<div>
  <h2>
    Configure Iron Man's suit below:
  </h2>
  <div class="suit-" data-view="iron_man_suit_view">
    <div id="suitConfig">
  </div>
</div>
```

When EndDash runs into a `data-view`, it will lookup the view and initialize it
with the model in scope at the DOM element where the view is initialized.

To lookup the view, EndDash uses a simple view store. You can register views by
calling `EndDash.registerView` with the view name and the view class object. You can
also define your own function and pass it into `EndDash.setCustomGetView`

```javascript
EndDash.registerView('myViewName', viewObj);
```

```javascript
var views = {},
    getViews = function(name) {
      return views[name];
};
EndDash.setCustomGetView(getViews);
```

Templates
=========

## Registering a Template

This can be done manually.

```js
EndDash.registerTemplate('greetings','<div>Hello Citizens, I am <span class="name-"></span></div>');
```

Or, via ```EndDash.bootstrap```.

To bootstrap, have your templates loaded as scripts of type 'enddash' on the page.

```html
<script type='text/enddash' name='greetings'>
  <div>
    Hello Citizens, I am <span class="name-"></span>
  </div>
</script>
```

Then call ```EndDash.bootstrap```.

```javascript
$.ready(function() {
  // Load all the templates on the page.
  EndDash.bootstrap();
)};
```

## Binding to a Template

First, get the EndDash-parsed version of your template.

```js
var template = EndDash.getTemplate('greetings');
```

Then bind it to a model.

```js
var hero = new Backbone.Model({name: 'Superman'}),
    boundTemplate = template.bind(hero);
```

This can be done in a single step, by passing a model
as a second argument to ```EndDash.getTemplate```.

```js
var hero = new Backbone.Model({name: 'Superman'}),
    boundTemplate = EndDash.getTemplate('greetings', hero);
  ```

## Displaying HTML of a bound Template

Show the el property of the template.

```js
$('.content').html(boundTemplate.el);
```

Partials
========

Small, reusable, components of HTML can be templated in EndDash as partials.
To use a partial, add `src='templateName'` as an attribute to an element with no children.

```html
<script type='text/enddash' name='superheroes'>
  <img src="#{logo}" />
  <div class='heroes-'>
    <div src='superhero-navigation' data-replace></div>
  </div>
</script>
```
The partial will be passed the model in scope as its root element.

The data-replace attribute tells EndDash to substitute the partial's root element for its partial.
Without data-replace, EndDash will embed the root element beneath the partial's element and leave it.

If elsewhere you define this partial as:

```html
<script type='text/enddash' name='superhero-navigation'>
  <ul data-each>
    <li>
      <a href='#{url}'><span class='name-'></span></a>
    </li>
  </ul>
</script>
```

And bind to the top level template with:

```javascript
template.bind({
    heroes: new Backbone.Collection([
      new Backbone.Model({name: 'Iron Man', url: '/superheroes/techGenius'}),
      new Backbone.Model({name: 'Spiderman', url: '/superheroes/webMaster'}),
      new Backbone.Model({name: 'Superwoman', url: '/superheroes/strong'})
    ]),
    logo: '/public/emblems/protectTheWorld'
});
```

This will result in:

```html
<img class='/public/emblems/protectTheWorld'>
<div class='heroes-'>
  <ul>
    <li><a href='/superheroes/techGenius'>Iron Man</a></li>
    <li><a href='/superheroes/webMaster'>Spiderman</a></li>
    <li><a href='/superheroes/strong'>Superwoman</a></li>
  </ul>
</div>
```

Debugging
=========

Open up a debugger in development mode to inspect the context of the
template.

Open a context in the highest template scope:
```html
<body>
  <div debugger />
</body>
```

In a child model scope:
```html
<body>
  <div class="questions-">
    <!-- Open a debugger in the scope of get('questions') -->
    <div debugger />
  </div>
</body>
```

Misc
====

## Dependencies

In its current release, EndDash relies on Backbone's event system to update
the DOM when a bound object changes. This means only templates bound to
Backbone objects will live-update.

If you use EndDash with regular JS objects, it'll still interpolate the
attributes but won't update the template when the object's attributes change.
