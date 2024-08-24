# JavaScript Deep Clone: Recursive and Non-recursive Approaches

This repository contains two implementations of deep cloning in JavaScript: a recursive approach and a non-recursive approach. Both methods are thoroughly tested using Jest to ensure correctness across various scenarios.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Deep Clone Implementations](#deep-clone-implementations)
  - [Recursive Approach](#recursive-approach)
  - [Non-recursive Approach](#non-recursive-approach)
- [Running Jest Tests](#running-jest-tests)
- [Test Coverage](#test-coverage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Deep cloning is a technique used to create a fully independent copy of an object, including all nested objects and arrays. This repository explores two approaches to deep cloning: a simple recursive approach and a more complex non-recursive approach. Both methods are designed to handle various JavaScript data types, including special objects like `Date`, `RegExp`, `Map`, and `Set`.

## Installation

To get started, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/yourusername/deep-clone-js.git
cd deep-clone-js
npm install
```

## Usage

The main deep cloning functions are located in the `deepClone.js` file. You can import and use them in your project as follows:

```javascript
const { deepCloneRecursive, deepClone } = require('./deepClone');

const original = { name: 'Alice', age: 30 };
const copy = deepCloneRecursive(original); // or deepClone(original);

console.log(copy); // { name: 'Alice', age: 30 }
console.log(copy === original); // false
```

## Deep Clone Implementations

### Recursive Approach

The recursive approach is straightforward and easier to understand. It uses recursion to traverse and copy all nested objects and arrays.

### Non-recursive Approach

The non-recursive approach avoids stack overflow by using a stack to simulate recursion. It is more complex but can handle very large and deeply nested objects more efficiently.

## Running Jest Tests

This repository includes comprehensive Jest unit tests to ensure that both deep cloning functions work correctly. To run the tests, use the following command:

```bash
npm test
```

You can also run the tests with coverage:

```bash
npm test -- --coverage
```

## Test Coverage

The Jest tests cover the following scenarios:

- Primitive types (numbers, strings, null, etc.)
- Arrays
- Plain objects
- Special objects (`Date`, `RegExp`, `Map`, `Set`)
- Circular references
- Objects with `Symbol` keys
- Non-enumerable properties
- Prototype chain preservation

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.