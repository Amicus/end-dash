  End Dash is a client side templating language, you write templates in semantic HTML.

Getting started
===============

```
  npm install
  mocha test
```

Setting variables
-----------------

  To start we'll create a new template. Then set pageTitle on the template.

```
<h1 class = "pageTitle-"></h1>
```
The javascript
```
var template = new EndDash("html from above")
template.set("pageTitle", "The title of the page")
```

Enumerable Blocks
-----------------

```
<ol class = "people-">
  <li class = "person-">
    <div class = "name-"></div>
    <div class = "title-"></div>
  </li>
</ol>
```

```
var template = new EndDash("html from above")
template.set("people", [{name: "Zach", title: "Developer"}, {name: "Dog", title: "Mr"}])
```
