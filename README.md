  End Dash is a client side templating language, you write templates in semantic HTML.

Getting started
===============

```
  npm install
  mocha test
```
Or, as a bower component,
```
  bower install
```

Example
=======

Here's an example of a typical end-dash template:

```
<div class = "message">
Hey <a class = "name-" href = "/users/{user_id}"></a>,
Here are some things to try in end dash:
<ul class = "things-">
  <li class = "thing-">
    <div class = "title-"></div>
    <div class = "description-"></div>
  </li>
</ul>
```

Collections
===========

Defining Collections in end-dash is really easy.  
  * Step One: Make a container with the plural name of your objects as class name
  * Step Two: Inside the previous container, make another element with the singular of your object as the class name
  * Step Three: Add dashes to the classes

example
-------

```
<ul class = "things-">
  <li class = "thing-">
    <div class = "title-"></div>
    <div class = "description-"></div>
  </li>
</ul>
```

This is a collection of things.  Each thing has a title and a description. 
