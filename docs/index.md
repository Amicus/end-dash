EndDash
-------

  * *Compiled* on the server.
  * *Prepopulated* with data on the server.
  * *One* & *two* way binding.
  * *Extensible* easily extensible.

Usage
=====
```
<div class="cause-">
  <div class="title-"></div>
  <img src="/photos/#{supporterPhotos}" />
  <ul class="supporters-">
    <li class="supporter-">
      <span class="name-"></span> has been supporting 
      <span class="title-" data-scope=".."></span> since
      <span class="startDate-"></span>
    </li>
  </ul>
</div>
```

```
var Template = require("./templates/causes/show")
  , template = new Template({ cause: cause })

template.attachTo($("body"))
```

Any changes that occur on the cause model will automatically update in the dom

Variables
---------

  To define a simple variable you just do this.

  Template

```
<div class="name-"></div>
```

  JavaScript

```
var template = new SimpleTemplate({ name: "Zach" })
```

  Output

```
<div class="name-">Zach</div>
```

  In the same vein, if you want to bind it to 
a backbone model.

  Javascript with backbone

```
var person = new Model({ name: "Zach" })
  , template = new SimpleTemplate(person)
```

This has the same output as the original. However, if I
change the `person`

```
person.set("name", "Topper")
```                 

I get the following. 

```
<div class="name-">Topper</div>
```                 

Scopes
------

  Scopes bind an element and all child elements to a new model.

```
<div class="user-">
  <div class="name-"></div>
  <div class="profile-">
    <div class="hobby-"></div>
  </div>
</div>
```

```
var user = new Model({ 
  name: "Zach",
  profile: new Model({
    hobby: "running"
  })
})

var template = new ScopeTemplate({ user: user })
```

And blam, you get:
```
<div class="user-">
  <div class="name-">Zach</div>
  <div class="profile-">
    <div class="hobby-">running</div>
  </div>
</div>
```
