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
