Partials
========

Small, reusable components of HTML can be templated in EndDash as partials.
To use a partial, add `data-src='templateName'` as an attribute to an element with no children.

```html
<div data-src='myPartial' data-replace></div>
```

The data-replace attribute tells EndDash to substitute the partial's root element for this element.
Without data-replace, EndDash will embed the root element beneath the partial's element and leave it.

Load the partial you are referencing into EndDash before binding to the template.