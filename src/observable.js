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
