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