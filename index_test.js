const configSetup = require('./');

describe('configSetup', () => {


  class MyClass {

    constructor(){
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

        arguments,

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

    }
  }

  it('Should define the configuration object properly', () => {
    const myClass1 = new MyClass(false);

    expect(myClass1.config.booleanProp)
      .toBe(false);
    expect(myClass1.config.arrayProp)
      .toEqual([1,2,3]);

    const myClass2 = new MyClass([0]);

    expect(myClass2.config.booleanProp)
      .toBe(true);
    expect(myClass2.config.arrayProp)
      .toEqual([0]);

    const myClass3 = new MyClass({c:null}, false, [0]);

    expect(myClass3.config.booleanProp)
      .toBe(false);
    expect(myClass3.config.arrayProp)
      .toEqual([0]);
    expect(myClass3.config.objectProp)
      .toEqual({c:null});

    const myClass4 = new MyClass([0], {c:null}, false);

    expect(myClass4.config.booleanProp)
      .toBe(false);
    expect(myClass4.config.arrayProp)
      .toEqual([0]);
    expect(myClass4.config.objectProp)
      .toEqual({c:null});

  });

});