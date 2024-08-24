function deepCloneRecursive(value, cloneMap = new WeakMap()) {
  // Base case: Return primitive values or null as is
  if (typeof value !== 'object' || value === null) return value;

  // Circular reference check
  if (cloneMap.has(value)) return cloneMap.get(value);

  // Handle Date and RegExp objects specifically
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  // Handle Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    cloneMap.set(value, clonedMap);
    value.forEach((val, key) => 
      clonedMap.set(deepCloneRecursive(key, cloneMap), deepCloneRecursive(val, cloneMap))
    );
    return clonedMap;
  }

  // Handle Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    cloneMap.set(value, clonedSet);
    value.forEach(val => clonedSet.add(deepCloneRecursive(val, cloneMap)));
    return clonedSet;
  }

  // Handle plain objects and arrays
  const clonedObj = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  cloneMap.set(value, clonedObj);

  // Recursively clone each property
  Reflect.ownKeys(value).forEach(key => {
    if (Object.prototype.propertyIsEnumerable.call(value, key)) {
      clonedObj[key] = deepCloneRecursive(value[key], cloneMap);
    }
  });

  return clonedObj;
}

function deepClone(value) {
  // Base case: Return primitive values or null as is
  if (typeof value !== 'object' || value === null) return value;

  const cloneMap = new WeakMap();

  // Helper function to create an empty clone based on the item type
  function createEmptyClone(item) {
    const type = Object.prototype.toString.call(item);
    switch (type) {
      case '[object Array]': return [];
      case '[object Object]': return Object.create(Object.getPrototypeOf(item));
      case '[object Date]': return new Date(item.getTime());
      case '[object RegExp]': return new RegExp(item.source, item.flags);
      case '[object Map]': return new Map();
      case '[object Set]': return new Set();
      default: throw new Error(`Unsupported type: ${type}`);
    }
  }

  // Process each item in the stack (used instead of recursion)
  function processItem(item, clone, stack) {
    if (item instanceof Map) {
      item.forEach((value, key) => {
        if (typeof value === 'object' && value !== null) {
          const newClone = cloneMap.get(value) || createEmptyClone(value);
          clone.set(key, newClone);
          if (!cloneMap.has(value)) {
            cloneMap.set(value, newClone);
            stack.push({ original: value, clone: newClone });
          }
        } else {
          clone.set(key, value);
        }
      });
    } else if (item instanceof Set) {
      item.forEach(value => {
        if (typeof value === 'object' && value !== null) {
          const newClone = cloneMap.get(value) || createEmptyClone(value);
          clone.add(newClone);
          if (!cloneMap.has(value)) {
            cloneMap.set(value, newClone);
            stack.push({ original: value, clone: newClone });
          }
        } else {
          clone.add(value);
        }
      });
    } else {
      Reflect.ownKeys(item).forEach(key => {
        if (Object.prototype.propertyIsEnumerable.call(item, key)) {
          const value = item[key];
          if (typeof value === 'object' && value !== null) {
            const newClone = cloneMap.get(value) || createEmptyClone(value);
            clone[key] = newClone;
            if (!cloneMap.has(value)) {
              cloneMap.set(value, newClone);
              stack.push({ original: value, clone: newClone });
            }
          } else {
            clone[key] = value;
          }
        }
      });
    }
  }

  // Initialize the stack with the root object
  const rootClone = createEmptyClone(value);
  cloneMap.set(value, rootClone);
  const stack = [{ original: value, clone: rootClone }];

  // Process the stack until all items are cloned
  while (stack.length > 0) {
    const { original, clone } = stack.pop();
    processItem(original, clone, stack);
  }

  return rootClone;
}

module.exports = { deepCloneRecursive, deepClone };