# Deep Clone Functions

This project provides two implementations of a deep cloning function in JavaScript: a recursive approach and a non-recursive approach. Both functions are designed to create a deep copy of complex JavaScript objects, including handling of circular references and special object types.

## Features

- Supports cloning of:
  - Primitive types
  - Objects and Arrays
  - Date objects
  - RegExp objects
  - Map and Set objects
- Handles circular references
- Preserves prototype chain
- Clones non-enumerable properties
- Supports Symbol keys

## Usage

To use these functions in your project, import them from the `deepClone.js` file:

```javascript
const { deepCloneRecursive, deepClone } = require('./deepClone');
```

### Recursive Approach

```javascript
const original = { /* your complex object here */ };
const cloned = deepCloneRecursive(original);
```

### Non-recursive Approach

```javascript
const original = { /* your complex object here */ };
const cloned = deepClone(original);
```

Both functions will return a deep clone of the input object.

## Implementation Details

### Recursive Approach (`deepCloneRecursive`)

This function uses recursion to traverse the object structure. It's simpler to understand but may hit stack size limits for very deeply nested objects.

### Non-recursive Approach (`deepClone`)

This function uses an iterative approach with a stack to avoid recursion. It's more complex but can handle arbitrarily deep object structures without stack overflow issues.

## Testing

The project includes a comprehensive test suite in `deepClone.test.js`. To run the tests, make sure you have Jest installed and run:

```
npm test
```

The tests cover various scenarios including:
- Primitive types
- Complex nested objects
- Circular references
- Special object types (Date, RegExp, Map, Set)
- Objects with Symbol keys
- Prototype chain preservation

## Limitations

- Functions are not cloned; they are referenced in the cloned object.
- Does not support cloning of other specialized built-in objects like WeakMap, WeakSet, etc.
- May not correctly handle non-standard objects or those with custom [Symbol.toStringTag] implementations.

## Contributing

Feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.