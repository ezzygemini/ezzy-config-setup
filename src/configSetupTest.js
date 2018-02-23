const configSetup = require('./configSetup');

describe('configSetup', () => {


  class MyClass {

    constructor(...args) {
      /**
       * @type {Object}
       * @prop {boolean} booleanProp
       * @prop {Array} arrayProp
       * @prop {object} objectProp
       */
      this.config = configSetup(
        {
          booleanProp: true,
          arrayProp: [1, 2, 3],
          objectProp: {a: null, b: null}
        },

        args,

        ['this:object'],

        ['arrayProp:array'],
        ['booleanProp:boolean'],

        ['booleanProp:boolean', 'arrayProp:array'],
        ['arrayProp:boolean', 'objectProp:object'],
        ['objectProp:object', 'arrayProp:array'],

        ['booleanProp:boolean', 'arrayProp:array', 'objectProp:object'],
        ['objectProp:object', 'booleanProp:boolean', 'arrayProp:array'],
        ['arrayProp:array', 'objectProp:object', 'booleanProp:boolean']
      );

      this.config2 = configSetup(args, {
        test: null
      }, ['this']);

      this.config3 = configSetup({
        test: null
      }, args, ['this:object']);

      this.config4 = configSetup(args, ['this:object']);

    }
  }

  it('Should define the configuration object properly', () => {
    const myClass1 = new MyClass(false);

    expect(myClass1.config.booleanProp).toBe(false);
    expect(myClass1.config.arrayProp).toEqual([1, 2, 3]);

    const myClass2 = new MyClass([0]);

    expect(myClass2.config.booleanProp).toBe(true);
    expect(myClass2.config.arrayProp).toEqual([0]);

    const myClass3 = new MyClass({c: null}, false, [0]);

    expect(myClass3.config.booleanProp).toBe(false);
    expect(myClass3.config.arrayProp).toEqual([0]);
    expect(myClass3.config.objectProp).toEqual({c: null});

    const myClass4 = new MyClass([0], {c: null}, false);

    expect(myClass4.config.booleanProp).toBe(false);
    expect(myClass4.config.arrayProp).toEqual([0]);
    expect(myClass4.config.objectProp).toEqual({c: null});

    const myClass5 = new MyClass({test: 1});

    expect(myClass5.config2.test).toBe(1);
    expect(myClass5.config3.test).toBe(1);
    expect(myClass5.config4.test).toBe(1);

  });

  it('should define an optional configuration properly', () => {
    const getConfig = (...args) => configSetup({
        arrayProp: [],
        optionalBoolean: false
      }, args,
      ['arrayProp : array?', 'optionalBoolean : boolean | undefined']);
    let config = getConfig(undefined, true);
    expect(config.arrayProp).toEqual([]);
    expect(config.optionalBoolean).toBe(true);
    config = getConfig([1,2,3], undefined);
    expect(config.arrayProp).toEqual([1,2,3]);
    expect(config.optionalBoolean).toBe(false);
  });

});