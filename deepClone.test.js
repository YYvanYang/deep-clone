// deepClone.test.js

const { deepCloneRecursive, deepClone } = require('./deepClone');

describe('Deep Clone - Recursive and Non-recursive Approaches', () => {
  const testCases = [
    {
      description: 'should handle primitive types',
      input: 42,
      expected: 42,
    },
    {
      description: 'should handle strings',
      input: 'Hello, World!',
      expected: 'Hello, World!',
    },
    {
      description: 'should handle null values',
      input: null,
      expected: null,
    },
    {
      description: 'should handle arrays',
      input: [1, 2, 3],
      expected: [1, 2, 3],
    },
    {
      description: 'should handle plain objects',
      input: { name: 'Alice', age: 30 },
      expected: { name: 'Alice', age: 30 },
    },
    {
      description: 'should handle nested objects',
      input: { name: 'Alice', address: { city: 'Wonderland' } },
      expected: { name: 'Alice', address: { city: 'Wonderland' } },
    },
    {
      description: 'should handle Date objects',
      input: new Date('2023-08-24T00:00:00Z'),
      expected: new Date('2023-08-24T00:00:00Z'),
    },
    {
      description: 'should handle RegExp objects',
      input: /abc/i,
      expected: /abc/i,
    },
    {
      description: 'should handle Map objects',
      input: new Map([['key1', 'value1'], ['key2', 'value2']]),
      expected: new Map([['key1', 'value1'], ['key2', 'value2']]),
    },
    {
      description: 'should handle Set objects',
      input: new Set([1, 2, 3]),
      expected: new Set([1, 2, 3]),
    },
    {
      description: 'should handle circular references',
      input: (() => {
        const obj = { name: 'Alice' };
        obj.self = obj;
        return obj;
      })(),
      expected: (() => {
        const obj = { name: 'Alice' };
        obj.self = obj;
        return obj;
      })(),
    },
  ];

  const complexTestCases = [
    {
      description: 'should handle deeply nested objects with various types',
      input: {
        a: 1,
        b: 'string',
        c: null,
        d: undefined,
        e: {
          f: [1, 2, { g: new Date('2023-08-24T00:00:00Z') }],
          h: new Map([['key', { i: new Set([1, 2, 3]) }]]),
          j: Symbol('test'),
          k: /test/gi,
          m: {
            n: {
              o: {
                p: [[[1]]]
              }
            }
          }
        }
      },
      expected: (result) => {
        expect(result).toEqual(expect.objectContaining({
          a: 1,
          b: 'string',
          c: null,
          d: undefined,
          e: expect.objectContaining({
            f: [1, 2, { g: expect.any(Date) }],
            h: expect.any(Map),
            j: expect.any(Symbol),
            k: /test/gi,
            m: {
              n: {
                o: {
                  p: [[[1]]]
                }
              }
            }
          })
        }));
        expect(result.e.f[2].g).toEqual(new Date('2023-08-24T00:00:00Z'));
        expect(result.e.h.get('key').i).toEqual(new Set([1, 2, 3]));
        expect(result).not.toBe(complexTestCases[0].input);
        expect(result.e).not.toBe(complexTestCases[0].input.e);
      }
    },
    {
      description: 'should handle objects with multiple circular references',
      input: (() => {
        const obj1 = { a: 1 };
        const obj2 = { b: 2 };
        const obj3 = { c: 3 };
        obj1.ref1 = obj2;
        obj2.ref2 = obj3;
        obj3.ref3 = obj1;
        obj1.self = obj1;
        return obj1;
      })(),
      expected: (result) => {
        expect(result).toEqual(expect.objectContaining({
          a: 1,
          ref1: expect.objectContaining({
            b: 2,
            ref2: expect.objectContaining({
              c: 3,
              ref3: expect.any(Object)
            })
          }),
          self: expect.any(Object)
        }));
        expect(result.ref1.ref2.ref3).toBe(result);
        expect(result.self).toBe(result);
        expect(result).not.toBe(complexTestCases[1].input);
      }
    },
    {
      description: 'should handle arrays with circular references',
      input: (() => {
        const arr = [1, 2, 3];
        arr.push(arr);
        arr.push({ref: arr});
        return arr;
      })(),
      expected: (result) => {
        expect(result).toEqual([1, 2, 3, expect.any(Array), expect.objectContaining({ref: expect.any(Array)})]);
        expect(result[3]).toBe(result);
        expect(result[4].ref).toBe(result);
        expect(result).not.toBe(complexTestCases[2].input);
      }
    },
  ];

  const runTests = (cloneFunction, approach) => {
    describe(`${approach} Approach`, () => {
      testCases.forEach(({ description, input, expected }) => {
        test(description, () => {
          const result = cloneFunction(input);
          if (input instanceof Date || input instanceof RegExp) {
            expect(result).toEqual(expected);
          } else if (input instanceof Map || input instanceof Set) {
            expect(result).toEqual(expected);
            expect(result).not.toBe(input);
          } else if (typeof input === 'object' && input !== null) {
            expect(result).toEqual(expected);
            expect(result).not.toBe(input);
          } else {
            expect(result).toBe(expected);
          }
        });
      });
    });
  };

  const runComplexTests = (cloneFunction, approach) => {
    describe(`${approach} Approach - Complex Cases`, () => {
      complexTestCases.forEach(({ description, input, expected }) => {
        test(description, () => {
          const result = cloneFunction(input);
          expected(result);
        });
      });
    });
  };

  runTests(deepCloneRecursive, 'Recursive');
  runTests(deepClone, 'Non-recursive');

  runComplexTests(deepCloneRecursive, 'Recursive');
  runComplexTests(deepClone, 'Non-recursive');

  test('should correctly handle objects with Symbol keys', () => {
    const sym = Symbol('key');
    const input = { [sym]: 'value' };
    const expected = { [sym]: 'value' };

    const resultRecursive = deepCloneRecursive(input);
    const resultNonRecursive = deepClone(input);

    expect(resultRecursive).toEqual(expected);
    expect(resultRecursive).not.toBe(input);

    expect(resultNonRecursive).toEqual(expected);
    expect(resultNonRecursive).not.toBe(input);
  });

  test('should handle prototype chain correctly', () => {
    function Parent() {
      this.name = 'parent';
    }
    Parent.prototype.greet = function () {
      return 'Hello';
    };

    const child = new Parent();
    const resultRecursive = deepCloneRecursive(child);
    const resultNonRecursive = deepClone(child);

    expect(resultRecursive).toEqual(child);
    expect(resultRecursive.greet()).toBe('Hello');
    expect(Object.getPrototypeOf(resultRecursive)).toBe(Parent.prototype);

    expect(resultNonRecursive).toEqual(child);
    expect(resultNonRecursive.greet()).toBe('Hello');
    expect(Object.getPrototypeOf(resultNonRecursive)).toBe(Parent.prototype);
  });

  test('should handle deep nested Maps and Sets', () => {
    const originalMap = new Map([
      ['key1', new Set([1, 2, { nested: 'value' }])],
      ['key2', new Map([['nestedKey', 'nestedValue']])]
    ]);

    const clonedMapRecursive = deepCloneRecursive(originalMap);
    const clonedMapNonRecursive = deepClone(originalMap);

    [clonedMapRecursive, clonedMapNonRecursive].forEach(clonedMap => {
      expect(clonedMap).toEqual(originalMap);
      expect(clonedMap).not.toBe(originalMap);

      const set = clonedMap.get('key1');
      expect(set).toBeInstanceOf(Set);
      expect(set).not.toBe(originalMap.get('key1'));
      
      const setValues = Array.from(set);
      expect(setValues[2]).toEqual({ nested: 'value' });
      expect(setValues[2]).not.toBe(Array.from(originalMap.get('key1'))[2]);

      const nestedMap = clonedMap.get('key2');
      expect(nestedMap).toBeInstanceOf(Map);
      expect(nestedMap).not.toBe(originalMap.get('key2'));
      expect(nestedMap.get('nestedKey')).toBe('nestedValue');
    });
  });

  test('should handle functions', () => {
    const original = {
      method: function() { return this.value; },
      value: 42
    };

    const clonedRecursive = deepCloneRecursive(original);
    const clonedNonRecursive = deepClone(original);

    [clonedRecursive, clonedNonRecursive].forEach(cloned => {
      expect(cloned.method).toBe(original.method);  // Functions are not cloned, just referenced
      expect(cloned.method()).toBe(42);
      
      original.value = 100;
      expect(cloned.method()).toBe(42);  // The cloned object should have its own 'value'
    });
  });

  test('should handle Object.create(null)', () => {
    const original = Object.create(null);
    original.test = 'value';

    const clonedRecursive = deepCloneRecursive(original);
    const clonedNonRecursive = deepClone(original);

    [clonedRecursive, clonedNonRecursive].forEach(cloned => {
      expect(Object.getPrototypeOf(cloned)).toBeNull();
      expect(cloned.test).toBe('value');
      expect(cloned).not.toBe(original);
    });
  });
});