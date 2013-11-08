View Integration
================

Though EndDash let's you avoid having to create Backbone Views for many pieces
of dynamic behavior in your application by putting view logic in models/presenters
and changing the view state based on their state directly, it also helps simplify
configuring and initializing them when you need view logic.

Since Backbone view's are initialized with a model and a DOM element, and EndDash
integrates both of these, it makes it simple to declare a view to be bound to
a particular DOM element, and will automatically pass in the current model on the
top of it's stack when the view is initalized.

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

EndDash has a simple view store built in that you can register your views with by
calling `EndDash.registerView` with the view name and the view class, or you can
define your own getView function and pass it in to `EndDash.setCustomGetView`