var Hawk = (function(){

	// An exception class to be instantiated when a requested Hawk class name does not exist
	function DoesNotExistException(className){
		this.value = className;
		this.message = 'definition does not exist.';
		this.toString = function(){
			return this.value + ' ' + this.message;
		};
	}

	// An exception class to be instantiated when a value is Not of type number
	function NumberTypeError(value){
		this.value = value;
		this.message = 'must be a number.';
		this.toString = function(){
			return this.value + ' ' + this.message;
		};
	}

	// An exception class to be instantiated when a value is Not of type object
	function ObjectTypeError(value){
		this.value = value;
		this.message = 'must be an object.';
		this.toString = function(){
			return this.value + ' ' + this.message;
		};
	}

	// An exception class to be instantiated when a provided index is out of bounds
	function IndexOutOfBoundsException(index){
		this.value = index;
		this.message = 'is out of bounds.';
		this.toString = function(){
			return this.value + ' ' + this.message;
		};
	}

	// Internal Hawk Object
  var cKm = {
  	DoesNotExistException: DoesNotExistException,
  	NumberTypeError: NumberTypeError,
  	ObjectTypeError: ObjectTypeError,
  	IndexOutOfBoundsException: IndexOutOfBoundsException,

  	classMap: {},
  	mixinMap: {},

  	proxy: function(fn, scope){
  		return function(){
  			args = Array.prototype.slice.call(arguments);
  			fn.apply(scope, args);
  		};
  	},

  	extend: function(destination, source){
  		for(var index in source){
  			if(source.hasOwnProperty(index)){
  				destination[index] = source[index];
  			}
  		}
  	},

    // Get a class definition object by name, @param {string}
  	getDef: function(className){
  		var def = this.classMap[className];

  		if(typeof def === 'object'){
				return def;
			}else{
				throw new DoesNotExistException(className);
			}
  	},

  	// Get multiple class definitions by name, @param {string[]}
  	getDefs: function(classNames){
  		var classDefs = [],
			len = classNames.length,
			className;

			for(var i = 0; i < len; i++){
				className = classNames[i];
				def = this.getDef(className);

				classDefs.push(def);
			}

			return classDefs;
  	},

  	// Get a mixin class definition
		getMixinDef: function(className){
			return this.mixinMap[className];
		},

		// Mix a class definition with the specified classes, @param {object}, @param {string[]}
		mix: function(classMixinDef, mixinNames){
			var constructor = function(){},
				mixinName,
				mixinDef,
				len;

			classMixinDef.sprout.call(constructor.prototype, classMixinDef.config);

			if(mixinNames){
				len = mixinNames.length;

				for(var i = 0; i < len; i++){
					mixinName = mixinNames[i];
					mixinDef = this.getMixinDef(mixinName);

					mixinDef.sprout.call(constructor.prototype, mixinDef.config);
				}
			}

			return constructor;
		},

		// Create a constructor that will apply an object of properties to this
		createMixinConstructor: function(){
			var me = this;
			return function(config){
				me.extend(this, config);
				return this;
			};
		},

		// Create a mixin definition and add it to the mixin map
		createMixin: function(className, config, initFn){
			var Sprout = this.createMixinConstructor();

			this.mixinMap[className] = {
				sprout: Sprout,
				initFn: initFn,
				config: config
			};

			return this.mixinMap[className];
		},

		// Get a queue of init functions from the provided mixin names
		getInitQueue: function(mixinNames){
			var initQueue = [],
				mixinDef,
				initFn,
				len;

			if(mixinNames){
				len = mixinNames.length;

				for(var i = 0; i < len; i++){
					mixinDef = this.getMixinDef(mixinNames[i]);
					initFn = mixinDef.initFn;

					if(initFn){
						initQueue.unshift(initFn);
					}
				}
			}

			return initQueue;
		},

		// Add a class definition to the class map
		addClassDef: function(className, sprout, initQueue){
			this.classMap[className] = {
				sprout: sprout,
				initQueue: initQueue
			};
		},

		// Execute an initialization queue
		executeInitQueue: function(inBloom, initQueue){
			var len = initQueue.length,
				i = len - 1;

			while(i >= 0){
				initFn = initQueue[i]; //we unshifted into the front of the queue, so we want to pop to get mixin's in the right order
				initFn.call(inBloom);

				--i;
			}
		},

		// Define a new class, providing a configuration object
		def: function(className, config){
			var initFn = config['init'],
				mixinNames = config['mixins'],
				classMixinDef,
				mixedConstructor,
				initQueue;

			delete config['init'];

			initQueue = this.getInitQueue(mixinNames); //build init queue based on mixins
			
			if(initFn){
				initQueue.unshift(initFn);
			}

			classMixinDef = this.createMixin(className, config, initFn); //create this class as a mixin definition
			mixedConstructor = this.mix(classMixinDef, mixinNames); //apply specified mixins to this class  mixin
			this.addClassDef(className, mixedConstructor, initQueue); //define the mixed constructor as a class definition
		},

		// Generate a class instance
		gen: function(className, overrideConfig){
			var classDef = this.getDef(className),
				sprout = classDef.sprout,
				initQueue = classDef.initQueue,
				inBloom; //result of Object.create, a mid level class instance, before initializations have been applied

			overrideConfig = overrideConfig || {};

			inBloom = new sprout();
			this.extend(inBloom, overrideConfig);
			this.executeInitQueue(inBloom, initQueue);

			return inBloom; //in bloom is now full bloom! 
		}
  };

  return cKm;
})();
