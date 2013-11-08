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

When EndDash runs into a `data-view`, it will lookup the view and initalize it with the model
in scope.

To lookup the view, EndDash uses a simple view store. You can register views by
calling `EndDash.registerView` with the view name and the view class object. You can
also define your own function and pass it into `EndDash.setCustomGetView`

```js
EndDash.registerView('myViewName', viewObj);
```

```js
var views = {},
    getViews = function(name) {
      return views[name];
};
EndDash.setCustomGetView(getViews);
```