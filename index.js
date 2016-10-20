/*!
 * Copyright (c) 2016 Moises Romero
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const extend = require('extend');

/**
 * Obtains a true value of type of element
 * @param {*} anyValue The value to check
 * @returns {string}
 */
const trueTypeOf = anyValue => Object.prototype.toString.call(anyValue)
  .toLowerCase()
  .replace('[object ', '')
  .replace(']', '');

/**
 * Changes a number of arguments into a readable configuration object.
 * The arguments can have different organization, position, type, etc, which
 * turn into different properties.
 *
 * @example
 *
 *  // Example usage by simply passing arguments
 *  configSetup(arguments, ["method:string"], ["config:object", "callback"]);
 *
 * @example
 *
 *  // Example usage with a default configuration
 *  configSetup(
 *    defaultConfig,
 *    arguments,
 *    ["method:string"],
 *    ["config:object", "callback"]
 *  );
 *
 * @example
 *
 *  #Example Implementation
 *
 *  function MyClass() {
 *
 *    this.config = configSetup(
 *
 *      // default configuration properties
 *      {
 *        booleanProp: true,
 *        arrayProp: [ 1, 2, 3 ],
 *        objectProp: { a:null, b:null }
 *      },
 *
 *      // arguments passed to the constructor
 *      arguments,
 *
 *      // if there's only 1 object argument, it extends 'this' object
 *      ['this:object'],
 *
 *      // or it can look for type and override specific properties
 *      ['arrayProp:array'],
 *      ['booleanProp:boolean'],
 *
 *      // with 2 arguments, it overrides different properties
 *      // based on type
 *      ['booleanProp:boolean', 'arrayProp:array'],
 *      ['arrayProp:boolean', 'objectProp:object'],
 *      ['objectProp:object', 'arrayProp:array'],
 *
 *      // or has the ability to distinguish between positional arguments
 *      ['booleanProp:boolean', 'arrayProp:array', 'objectProp:object'],
 *      ['objectProp:object', 'booleanProp:boolean', 'arrayProp:array'],
 *      ['arrayProp:array', 'objectProp:object', 'booleanProp:boolean']
 *
 *    );
 *  }
 *
 *  // Therefore...
 *
 *  // single boolean argument
 *  var myClass1 = new MyClass(false);
 *  myClass1.config.booleanProp = false;
 *  myClass1.config.arrayProp = [1,2,3];
 *
 *  // single array argument
 *  var myClass2 = new MyClass([]);
 *  myClass2.config.booleanProp = true;
 *  myClass2.config.arrayProp = [];
 *
 *  // multiple positioned arguments
 *  var myClass3 = new MyClass({}, false, []);
 *  myClass3.config.booleanProp = false;
 *  myClass3.config.arrayProp = [];
 *  myClass3.config.objectProp = {};
 *
 *  // and now shuffled around
 *  var myClass4 = new MyClass([], {}, false);
 *  myClass4.config.booleanProp = false;
 *  myClass4.config.arrayProp = [];
 *  myClass4.config.objectProp = {};
 *
 *  // Cool, huh?!
 *  // Now we have achieved what Java already had for centuries.
 *
 * @returns {*}
 */
module.exports = (...allArgs) => {

  const elem0type = trueTypeOf(allArgs[0]);
  const elem1type = trueTypeOf(allArgs[1]);
  let args = allArgs[0];
  let configIx = -1;
  let i = 1;
  let ret = true;
  let config;
  let s;
  let name;
  let type;
  let value;
  let origConfig;

  // allow default configuration to be passed
  // in the first 2 arguments
  if (elem0type === 'object') {
    args = allArgs[1];
    configIx = 0;
    i = 2;
  } else if (elem1type === 'object') {
    args = allArgs[0];
    configIx = 1;
    i = 2;
  }

  /**
   * clone the original configuration
   */
  origConfig = configIx > -1 ? extend({}, allArgs[configIx]) : {};

  for (; i < allArgs.length; i++) {

    if (
      args.length === 1 &&
      allArgs[i] === 'this' &&
      trueTypeOf(allArgs[i]) === 'object'
    ) {

      return extend(origConfig, args);

    } else if (
      trueTypeOf(allArgs[i]) === 'array' &&
      allArgs[i].length === args.length
    ) {

      ret = true;
      config = extend({}, origConfig);

      for (s = 0; s < args.length; s++) {

        value = allArgs[i][s].split(':');
        name = value[0];
        type = value[1] || '*';

        if (name === 'this' && trueTypeOf(args[s]) === 'object') {
          extend(config, args[s]);
        } else if (type === '*' || trueTypeOf(args[s]) === type) {
          config[name] = args[s];
        } else {
          ret = false;
        }

      }

      if (ret) {
        return config;
      }

    }

  }

  return origConfig;
};