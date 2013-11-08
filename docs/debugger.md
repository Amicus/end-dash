Debugger
======

## Debugging

Open up a debugger in development mode to inspect the context of the
template.

Open a context in the highest template scope:
```html
<body>
  <div debugger />
</body>
```

In a child model scope:
```html
<body>
  <div class="questions-">
    <!-- Open a debugger in the scope of get('questions') -->
    <div debugger />
  </div>
</body>
```