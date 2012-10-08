End Dash is a client side templating language, you write templates in semantic HTML.

Getting started
===============

Just include end dash in your page via script tag.

Setting variables
-----------------

  To start we'll create a new template.

```
<h1 class = "pageTitle-"></h1>
```
The javascript
```
var template = new EndDash("html from above")
template.set("pageTitle", "The title of the page")
```
