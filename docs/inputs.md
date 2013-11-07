Inputs
======

## Text Inputs

EndDash does two-way binding of model attributes to inputs.  This is simple for
text inputs by adding the attribute classname with a dash at the end

```html
<p>
  What is your name?
  <input  type="text" class="name-">
</p>
```

## Radio buttons

EndDash also does two way binding with radio buttons, binding the selected radio
button's value to the referenced model attribute.

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

Checkboxes work too, though only for boolean attributes at the moment.
```html
<p>Do you want to receive notifications about Iron Man?</p>
<input type="checkbox" name="notifyList" class="notify-" />
```