// 1.0.4 Hawk.js | Copyright (c) 2013 Matthew Parke | (MIT LICENSE) hawkjs.org/#license
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
/**
*   Record class
*   Simple wrapper for data objects, intended to be the base objects for Cache
*/
Hawk.def('Record', {

  dirty: false,
  id: null,
  data: null,
  dataIndex: null,

  // Initialize the data
  init: function(){
    if(this.data === null){
      this.data = {};
    }
  },

  // Set the record id
  setId: function(id){
    if(typeof id === 'number'){
      this.id = id;
    }else{
      throw new Hawk.NumberTypeError(id);
    }
  },

  // Get the record id
  getId: function () {
    return this.id;
  },

  // Set the data 
  setData: function(data){
    if(typeof data === 'object'){
      this.data = data; // allow null and array
    }else{
      throw new Hawk.ObjectTypeError(data);
    }
  },

  // Get the data
  getData: function () {
    return this.data;
  },

  // Set the data index
  setDataIndex: function (dataIndex) {
    if(typeof dataIndex === 'number'){
      this.dataIndex = dataIndex;
    }else{
      throw new Hawk.NumberTypeError(dataIndex);
    }
  },

  // Get the data index
  getDataIndex: function () {
    return this.dataIndex;
  },

  // Get a value at the given key
  get: function (key) {
    return this.data[key];
  },

  // Set the value at a given key
  set: function (key, value) {
    this.data[key] = value;
    this.dirty = true;
  },

  // Get the dirty boolean
  isDirty: function () {
    return this.dirty;
  }
});
/**
*   Data management layer, uses Record objects and an Array
*   Provides convenience methods for managing data sets
*   
*   Recommended Use: Backing DOM lists and tables
*/
Hawk.def('Cache', {

  store: null,
  recCounter: 0,
  idCounter: 0,

  // initialize the store
	init: function(){
		this.store = [];
	},

  // Load an array of data objects into the cache
  load: function (dataArr) {
    var len = dataArr.length;

    for (var i = 0; i < len; i++) {
      this.add(dataArr[i]);
    }
  },

  // Get the size of the cache
  size: function(){
    return this.recCounter;
  },

  // Add an object of data to the cache
  add: function (data) {
    var record = Hawk.gen('Record', {
      id:this.idCounter,
      data:data
    });

    this.store.push(record);

    ++this.idCounter;
    ++this.recCounter;
  },

  // Remove a record from the cache
  remove: function (record) {
    var index = this.indexOf(record);

    if (index !== -1) {
      return this.removeAt(index);
    }else{
      return null;
    }
  },

  // Remove a record at a given index
  removeAt: function (index) {
    var record = this.getAt(index);
    
    if(record !== null){
      this.store.splice(index, 1);
      --this.recCounter;
    }

    return record;
  },

  // Remove all records from the cache
  removeAll: function () {
    this.recCounter = 0;
    this.idCounter = 0;

    return this.store.splice(0, this.store.length);
  },

  // Get the index of a given record
  indexOf: function (record) {
    var len = this.store.length,
      i = 0,
      found = false,
      comparison,
      index = -1;

    while (i < len && !found) {
      comparison = this.store[i];

      if (comparison.getId() === record.getId()) {
        index = i;
        found = true;
      }

      ++i;
    }

    return index;
  },

  // Get a record at a given index
  getAt: function (index) {
    if (index >= 0 && index < this.recCounter) {
      return this.store[index];
    } else {
      return null;
    }
  },

  // Get all records from the cache
  getRecords: function () {
    return this.store;
  },

  // Find and retrun a record by searching for the given key and value
  find: function (key, value) {
    var len = this.store.length,
      i = 0,
      found = false,
      rec = null;

    while (i < len && !found) {
      rec = this.store[i];

      if (rec.get(key) === value) {
        found = true;
      }

      ++i;
    }

    return rec;
  },

  // Get and return records which have changed and have been marked dirty
  getDirty: function () {
    var dirtyRecords = [],
      len = this.store.length,
      rec;

    for (var i = 0; i < len; i++) {
      rec = this.store[i];

      if (rec.isDirty()) {
        dirtyRecords.push(rec);
      }
    }

    return dirtyRecords;
  }
});
/**
*   Node object class used by LinkedList
*/
Hawk.def('Node', {

  id: null,
  data: null,
  next: null,
  prev: null,

  // Set the id
  setId: function (id) {
    if(typeof id === 'number'){
      this.id = id;
    }else{
      throw new Hawk.NumberTypeError(id);
    }
  },

  // Get the id
  getId: function () {
    return this.id;
  },

  // Set data
  setData: function (data) {
    this.data = data;
  },

  // Get data
  getData: function () {
    return this.data;
  }
});
/**
*   Linked List
*   [Doubly Linked](http://en.wikipedia.org/wiki/Doubly_linked_list)
*/
Hawk.def('LinkedList', {

  // Initialze the doubly linked list
  init: function () {
    this.start = Hawk.gen('Node',{
    	id:null,
    	data:null
    });

    this.end = Hawk.gen('Node',{
    	id:null,
    	data:null
    });

    this.start.next = this.end;
    this.start.prev = null;
    this.end.prev = this.start;
    this.end.next = null;

    this.idCounter = 0;
    this.numNodes = 0;
  },

  // Add to the end of the list
  add: function (data) {
    this.addLast(data);
  },

  // Add to the end of the list
  addLast: function (data) {
    var node = Hawk.gen('Node',{
      id: this.idCounter,
      data: data
    });

    last = this.end;

    this.insertBefore(last, node);

    ++this.idCounter;
    ++this.numNodes;
  },

  // Insert before a given node in the list
  insertBefore: function (toInsertBefore, node) {
    node.next = toInsertBefore;
    node.prev = toInsertBefore.prev;

    toInsertBefore.prev.next = node;
    toInsertBefore.prev = node;
  },

  // Get the first node in the list
  getFirst: function () {
    if (this.numNodes === 0) {
      return null;
    } else {
      return this.start.next;
    }
  },

  // Get the last node in the list
  getLast: function () {
    if (this.numNodes === 0) {
      return null;
    } else {
      return this.end.prev;
    }
  },

  // Finds and returns the node at the specified index, starting at the beginning of the list
  getFromFirst: function (index) {
    var count = 0,
      temp = this.start.next;

    if(index >= 0){
      while (count < index && temp !== null) {
        temp = temp.next;
        ++count;
      }
    }else{
      temp = null;
    }

    if(temp === null){
      throw new Hawk.IndexOutOfBoundsException(index);
    }

    return temp;
  },

  // Gets a node at the specific index
  getAt: function (index) {
    var count = 0,
      temp = null;

    if (index === 0) {
      temp = this.getFirst();
    } else if (index === this.numNodes - 1) {
      temp = this.getLast();
    } else {
      temp = this.getFromFirst(index);
    }

    return temp;
  },

  // Gets the size of the list
  size: function () {
    return this.numNodes;
  },

  // Remove and return a node from the list
  remove: function (node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    --this.numNodes;

    return node;
  },

  // Remove the first node in the list
  removeFirst: function () {
    var temp = null;

    if (this.numNodes > 0) {
      temp = this.remove(this.start.next);
    }

    return temp;
  },

  // Remove the last node from the list
  removeLast: function () {
    var temp = null;

    if (this.numNodes > 0) {
      temp = this.remove(this.end.prev);
    }

    return temp;
  },

  // Remove all nodes from the list
  removeAll: function(){
    this.start.next = this.end;
    this.end.prev = this.start;
    this.numNodes = 0;
  }
});
/**
*   Observable event mixin
*/
Hawk.def('Observable', {

    // Initialize events and aliases
	init: function(){
		this.events = {};

    // Add an event listener
    this.on = this.addListener;
    // Remove an event listener
    this.off = this.removeListener;
    // Fires an event by name, with variable arguments
    this.fire = this.fireEvent;
	},

  // Add an event name 
  addEvent: function (eventName) {
    this.events[eventName] = null;
  },

  // Add multiple event names
  addEvents: function (eventNames) {
    var len = eventNames.length;

    for (var i = 0; i < len; i++) {
      this.addEvent(eventNames[i]);
    }
  },

  // Add an event listener
  addListener: function (eventName, callback, scope) {
    var eventMapping = this.events[eventName],
	    proxy;

    if (eventMapping === null) {
      //this event mapping has been initialized
      proxy = Hawk.proxy(callback, scope);

      this.events[eventName] = proxy;
    }
  },

  // Remove an event listener
  removeListener: function (eventName) {
    var eventMapping = this.events[eventName];

    if (eventMapping !== null && eventMapping !== undefined) {
      this.events[eventName] = null;
    }
  },

  // Fire an event by name, with an arbitrary number of additional arguments to be passed
  // expects the first argument to be the event name.
  fireEvent: function () {
    var args = Array.prototype.slice.call(arguments),
    	eventName = args.shift(),
    	eventMapping = this.events[eventName];
    
    if (typeof eventMapping === 'function') {
      eventMapping.apply(this, args); //INVARIANT: the event mapping is a callback
    }
  }
});
/**
*   Publish and Subscribe Module
*   Allows for subscribing to and publishing global events
*   Will publish events in the order they are added as subscriptions
*
*/ 
Hawk.def('PubSub', {

  // Initialize subscriptions and aliases
  init: function(){
    this.subscriptions = {};
        
    // Subscribes to an event by name
    this.sub = this.registerSubscription;
    // Subscribes multiple event definitions
    this.subs = this.registerSubscriptions;
    // Publishes an event by name
    this.pub = this.publishEvent;
    // Registers an event mapping
    this.mapping = this.registerEventMappings;
  },

  // Registers an event subscription
  registerSubscription: function(eventName, callback, scope){
    var proxy = Hawk.proxy(callback, scope);

    if (!Array.isArray(this.subscriptions[eventName])) {
      this.subscriptions[eventName] = []; //INVARIANT: the event does not exist, create room it before pushing
    }

    this.subscriptions[eventName].push(proxy);
  },

  /** 
  *   Parameter structure:
  *   events: [
  *       {
  *           eventName: '',
  *           callback: function(){}
  *       }
  *   ],
  *   scope: this
  */
  // Registers multiple event subscriptions
  registerSubscriptions: function (events, scope) {
    var len = events.length,
      evt, eventName, callback;

    for (var i = 0; i < len; i++) {
      evt = events[i];
      eventName = evt.eventName;
      callback = evt.callback;

      this.registerSubscription(eventName, callback, scope);
    }
  },

  // Publish an event with a variable number of arguments
  publishEvent: function () {
    var args = Array.prototype.slice.call(arguments),
      eventName = args.shift(),
      subArr = this.subscriptions[eventName],
      subCallback,
      len;

    if (Array.isArray(subArr)) {
      len = subArr.length;

      for (var i = 0; i < len; i++) {
        subCallback = subArr[i];
        subCallback.apply(this, args); //args must be an array, but may or may not be empty!
      }
    }
  },

  // Generate a callback to be used in publishing an event from an event mapping
  genPublishCallback: function (reactions) {
    return function () {
      var len = reactions.length,
        reaction,
        args;


      for (var j = 0; j < len; j++) {
        reaction = reactions[j];
        args = reaction.useArgs ? Array.prototype.slice.call(arguments) : [];
        //push the event name as the first param
        args.unshift(reaction.eventName);

        this.publishEvent.apply(this, args);
      }
    };
  },

  /*
  *   RegisterEventMappings takes a configuration object in the following form:
  *   [
  *       {
  *           eventName:"datachange",
  *           reactions:[
  *               { eventName:"validateRecord", useArgs:true },
  *               { eventName:"postRecord",   useArgs:true }
  *           ]
  *       }
  *   ]
  */
  // Register an event mapping, typically specified as a .json config file
  registerEventMappings: function (maps) {
    var len = maps.length,
      events = [],
      eventName,
      reactions,
      reactionLen;

    for (var i = 0; i < len; i++) {
      eventName = maps[i].eventName;
      reactions = maps[i].reactions;

      events.push({
        eventName: eventName,
        callback: this.genPublishCallback(reactions)
      });
    }

    this.registerSubscriptions(events, this);
  }
});
