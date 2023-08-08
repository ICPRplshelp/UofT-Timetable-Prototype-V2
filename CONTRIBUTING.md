# Contributing to this repository

Want to contribute to something? Please read this before contributing.

## Code guidelines (for all JS/TS projects)

1. Only use JSON to serialize program state. Don't bother using anything else unless you happen to be serializing an image or an audio file.
2. JSON files store classes, NOT dictionaries. Do not use JSON as you would use a dictionary in Python, or a Hash Map in Java. The same applies to classes in JS - do NOT use a class like you would with a hash map. This means that your keys must be stable. If you want a collection of key value pairs, just store a bunch of `{key: string, value: T}` objects in a list, then have the frontend convert that into a Map (NOT an object).
3. Do not use an array for anything you should really be using a class for. Do not store (x, y) coordinates as `[0, 1]` -- you're better off storing them in a class or type such as `{x: 0, y: 1}`. This makes your code a lot more safe and way less error-prone, and it is an extreme pain to fix. TL;DR if you would use a Python tuple for something, just use a class, type, or interface.
4. Use the `extract method` feature in your IDE; it's very useful.
5. Do not use the `any` type for anything unless you're dealing with 3rd party libraries, and in that case keep `any` within the scope of the function if you have to.
6. Do not use Union types `|` unless:
   1. You're using data gotten from an HTTP request
   2. Everything in the union type inherits from the same non-built in superclass
7. For non-pure JS projects (React, Angular): Never use `document` to modify the HTML page.
