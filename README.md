  End Dash is a client side templating language, you write templates in semantic HTML.

Getting started
===============

```bash
npm install

# if you don't have grunt
npm install -g grunt-cli

# Run tests
grunt simplemocha

# If you don't want grunt
mocha test

# To run tests and watch for changes:
grunt watch
```

Or, as a bower component,

```bash
bower install
```

Example
=======

Here's an example of a typical end-dash template:

```html
<div class="message">
Hey <a class="name-" href="/users/{user_id}"></a>,
Here are some things to try in end dash:
<ul class="things-">
  <li class="thing-">
    <div class="title-"></div>
    <div class="description-"></div>
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

```html
<ul class="things-">
  <li class="thing-">
    <div class="title-"></div>
    <div class="description-"></div>
  </li>
</ul>
```

This is a collection of things.  Each thing has a title and a description. 

ideas
=====

  * This is only partially end-dash related, but we could do the template thing
implicitly in the router, i.e. given the router classname and method, we
get the correct template, and render it.  Unless you explicity declare what template
you want.

```coffeescript
class SocialMail extends BaseRouter
  "users/:userId/social_mail":"show"

  @before ->
    @currentUser = session.get("currentUser")

  show: (userId)->
    @socialMailConfiguration = SocialMailConfiguration.findBy { user: currentUser }
    @mailingExplanation = new MailingExplanation.findBy { initiative: session.get("currentInitiative") }
```

behind the scenes this would basically do. 

```coffeescript
Template = EndDash.getTemplate("/new/templates/social_mails/show") 

@template = new Template 
  currentUser: session.get("currentUser"), 
  socialMailConfiguration: SocialMailConfiguration.findBy { user: currentUser }
  etc: etc

#and then when another route is loaded...

@template.unbindAllEvents()
```
Boom, cleanup for free

  * We could also do the "layouts" thing.  i.e. we have a layout that gets autorendered
and then we render your template inside of that.
