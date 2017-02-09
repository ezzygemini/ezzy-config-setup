# configSetup
[![Build Status](https://travis-ci.org/ezzygemini/config-setup.svg?branch=master)](https://travis-ci.org/ezzygemini/config-setup)
[![Coverage Status](https://coveralls.io/repos/github/ezzygemini/config-setup/badge.svg?branch=master)](https://coveralls.io/github/ezzygemini/config-setup?branch=master)

Changes a number of arguments into a readable configuration object.
The arguments can have different organization, position, type, etc, which
turn into different properties.

```js
 // Example usage by simply passing arguments
 configSetup(arguments, ["method:string"], ["config:object", "callback"]);
```

```js
 // Example usage with a default configuration
 configSetup(
   defaultConfig,
   arguments,
   ["method:string"],
   ["config:object", "callback"]
 );
```

###  Example Implementation
```js
 
 function MyClass() {
   this.config = configSetup(
     
     // default configuration properties
     {
       booleanProp: true,
       arrayProp: [ 1, 2, 3 ],
       objectProp: { a:null, b:null }
     },

     // arguments passed to the constructor
     arguments,

     // if there's only 1 object argument, it extends 'this' object
     ['this:object'],

     // or it can look for type and override specific properties
     ['arrayProp:array'],
     ['booleanProp:boolean'],

     // with 2 arguments, it overrides different properties
     // based on type
     ['booleanProp:boolean', 'arrayProp:array'],
     ['arrayProp:boolean', 'objectProp:object'],
     ['objectProp:object', 'arrayProp:array'],

     // or has the ability to distinguish between positional arguments
     ['booleanProp:boolean', 'arrayProp:array', 'objectProp:object'],
     ['objectProp:object', 'booleanProp:boolean', 'arrayProp:array'],
     ['arrayProp:array', 'objectProp:object', 'booleanProp:boolean']

   );

 // Therefore...

 // single boolean argument
 var myClass1 = new MyClass(false);
 myClass1.config.booleanProp = false;
 myClass1.config.arrayProp = [1,2,3];

 // single array argument
 var myClass2 = new MyClass([]);
 myClass2.config.booleanProp = true;
 myClass2.config.arrayProp = [];

 // multiple positioned arguments
 var myClass3 = new MyClass({}, false, []);
 myClass3.config.booleanProp = false;
 myClass3.config.arrayProp = [];
 myClass3.config.objectProp = {};

 // and now shuffled around
 var myClass4 = new MyClass([], {}, false);
 myClass4.config.booleanProp = false;
 myClass4.config.arrayProp = [];
 myClass4.config.objectProp = {};

 // Cool, huh?!
 // Now we have achieved what Java already had for centuries.

```

