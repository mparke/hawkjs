describe('PubSub', function(){

	it('can be instantiated and has defaults', function(){
		var pubsub = Hawk.gen('PubSub');
		expect(pubsub).toBeDefined();
		expect(pubsub.subscriptions).toBeDefined();
	});

	it('PubSub.registerSubscription: can register a subscription.', function(){
		var pubsub = Hawk.gen('PubSub'),
			scope = {val: 10},
			eventHasFired = false,
			value = null;
		
		pubsub.registerSubscription('datachange', function(){
			eventHasFired = true;
			value = this.val;
		}, scope);

		pubsub.publishEvent('datachange');

		expect(eventHasFired).toBe(true);
		expect(value).toBe(10);
	});

	it('PubSub.registerSubscriptions: can register multiple subscriptions.', function(){
		var pubsub = Hawk.gen('PubSub'),
			scope = {datachange: 10, select: 20},
			dataChangeHasFired = false,
			dataChangedValue = null,
			selectHasFired = false,
			selectValue = null;

		pubsub.registerSubscriptions([
			{
				eventName: 'datachange',
				callback: function(){
					dataChangeHasFired = true;
					dataChangedValue = this.datachange;
				}	
			},
			{
				eventName: 'select',
				callback: function(){
					selectHasFired = true;
					selectValue = this.select;
				}
			}
		], scope);

		pubsub.publishEvent('datachange');
		pubsub.publishEvent('select');

		expect(dataChangeHasFired).toBe(true);
		expect(dataChangedValue).toBe(10);
		expect(selectHasFired).toBe(true);
		expect(selectValue).toBe(20);
	});

	it('PubSub.publishEvent: can publish an event with any number of arguments.', function(){
		var pubsub = Hawk.gen('PubSub'),
			scope = {val: 10},
			eventHasFired = false,
			value = null,
			arg1 = null,
			arg2 = null,
			arg3 = null;
		
		pubsub.registerSubscription('datachange', function(one, two, three){
			eventHasFired = true;
			value = this.val;

			arg1 = one;
			arg2 = two;
			arg3 = three;
		}, scope);

		pubsub.publishEvent('datachange', 100, 200, 300);

		expect(eventHasFired).toBe(true);
		expect(value).toBe(10);
		expect(arg1).toBe(100);
		expect(arg2).toBe(200);
		expect(arg3).toBe(300);
	});

	it('PubSub.genPublishCallback: can generate a callback to be used with event reactions.', function(){
		var pubsub = Hawk.gen('PubSub'),
			scope = {datachange: 10, select: 20},
			dataChangeHasFired = false,
			dataChangedValue = null,
			selectHasFired = false,
			selectValue = null;

		pubsub.registerSubscriptions([
			{
				eventName: 'datachange',
				callback: function(){
					dataChangeHasFired = true;
					dataChangedValue = this.datachange;
				}	
			},
			{
				eventName: 'select',
				callback: function(){
					selectHasFired = true;
					selectValue = this.select;
				}
			}
		], scope);

		var publishCallback = pubsub.genPublishCallback([
			{ eventName: 'datachange', useArgs: true },
			{ eventName: 'select', useArgs: true }
		]);

		pubsub.registerSubscription('comboevent', publishCallback, pubsub);
		pubsub.publishEvent('comboevent');

		expect(dataChangeHasFired).toBe(true);
		expect(dataChangedValue).toBe(10);
		expect(selectHasFired).toBe(true);
		expect(selectValue).toBe(20);
	});

	it('PubSub.registerEventMappings: can register an event configuration mapping.', function(){
		var pubsub = Hawk.gen('PubSub'),
			scope = {datachange: 10, select: 20},
			dataChangeHasFired = false,
			dataChangedValue = null,
			selectHasFired = false,
			selectValue = null;

		pubsub.registerSubscriptions([
			{
				eventName: 'datachange',
				callback: function(){
					dataChangeHasFired = true;
					dataChangedValue = this.datachange;
				}	
			},
			{
				eventName: 'select',
				callback: function(){
					selectHasFired = true;
					selectValue = this.select;
				}
			}
		], scope);

		pubsub.registerEventMappings([
			{
				eventName: 'comboevent',
				reactions: [
					{ eventName: 'datachange', useArgs: true },
					{ eventName: 'select', useArgs: true }
				]
			}
		]);
		
		pubsub.publishEvent('comboevent');

		expect(dataChangeHasFired).toBe(true);
		expect(dataChangedValue).toBe(10);
		expect(selectHasFired).toBe(true);
		expect(selectValue).toBe(20);
	});

});