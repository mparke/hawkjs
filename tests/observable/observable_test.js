describe('Observable', function(){

	it('can be instantiated with defaults.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();
		expect(observable.events).toBeDefined();
	});

	it('Observable.addEvent: can add an event name.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();

		observable.addEvent('datachange');
		observable.addEvent('click');
		observable.addEvent('select');

		expect(observable.events.datachange).toBeNull();
		expect(observable.events.click).toBeNull();
		expect(observable.events.select).toBeNull();
	});

	it('Observable.addEvents: can add multiple event names at once.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();

		observable.addEvents([
			'datachange',
			'click',
			'select'
		]);

		expect(observable.events.datachange).toBeNull();
		expect(observable.events.click).toBeNull();
		expect(observable.events.select).toBeNull();
	});

	it('Observable.addListener: can add a listener to an event name.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();

		observable.addEvent('datachange');
		expect(observable.events.datachange).toBeNull();

		observable.addListener('datachange', function(){}, {});
		expect(typeof observable.events.datachange).toBe('function');

		observable.addEvent('select');
		expect(observable.events.select).toBeNull();

		observable.addListener('select', function(){}, {});
		expect(typeof observable.events.select).toBe('function');
	});

	it('Observable.removeListener: can remove a listener from an event name.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();

		observable.addEvent('datachange');
		expect(observable.events.datachange).toBeNull();

		observable.addListener('datachange', function(){}, {});
		expect(typeof observable.events.datachange).toBe('function');

		observable.removeListener('datachange');
		expect(observable.events.datachange).toBeNull();

		observable.addEvent('select');
		expect(observable.events.select).toBeNull();

		observable.addListener('select', function(){}, {});
		expect(typeof observable.events.select).toBe('function');

		observable.removeListener('select');
		expect(observable.events.select).toBeNull();
	});

	it('Obervable.fireEvent: can fire an event listener with an arbitrary number of arguments.', function(){
		var observable = Hawk.gen('Observable');
		expect(observable).toBeDefined();

		observable.addEvent('datachange');
		expect(observable.events.datachange).toBeNull();

		var scope = {val: 10};
		observable.addListener('datachange', function(one, two, three){
			expect(null).toBeNull();
			expect(this.val).toBe(10);
		
			expect(one).toBe(100);
			expect(two).toBe(200);
			expect(three).toBe(300);
		}, scope);
		expect(typeof observable.events.datachange).toBe('function');

		observable.fireEvent('datachange', 100, 200, 300);
	});
});