# js-graphy Playground

This playground allows you to visualize, test, tweak and play with your mathematical JavaScript functions.

[Open the live playground!](http://laktak.github.io/js-graphy/)

To add a graph simply call `graph.add()` with your function. The only argument is x with y expected as the return value.

```js
graph.add(function(x) { return x*x; });
```

You can use normal JS code:

```
// add another graph
function easing(x) {
  return x + 0.3 * Math.sin(2 * Math.PI * x);
}
graph.add(easing);
```

Set colors:

```js
graph.add(function(x) { return -Math.round(x*x); }, "#00ff00");
```

To include external libraries use `// script="URL"`:

```js
// script="http://cdnjs.cloudflare.com/ajax/libs/mathjs/1.7.0/math.min.js"
graph.add(function(x) { return math.cube(x); });
```

## Gists

If you want to share your playground

- create a gist with your code
- and append your *gist-id* to the playground url:

http://laktak.github.io/js-graphy/#gist=f8944fa044d972456d35

## Thanks

Graphs are based on the [JavaScript Graphing Calculator by Richard Ye](https://github.com/yerich/Graphr).

Editing made possible by the [Ajax.org Cloud9 Editor](https://github.com/ajaxorg/ace).


