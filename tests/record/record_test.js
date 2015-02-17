describe('Record', function(){

	it('can be instantiated with defaults.', function(){
		var rec = Hawk.gen('Record');

		expect(rec).toBeDefined();
		expect(rec.dirty).toBe(false);
		expect(rec.isDirty()).toBe(false);
		expect(rec.id).toBe(null);
		expect(rec.getId()).toBe(null);
		expect(rec.data).toBeDefined();
		expect(rec.getData()).toBeDefined();
		expect(rec.dataIndex).toBe(null);
		expect(rec.getDataIndex()).toBe(null);

	});

	it('Record.setId: can get and set id.', function(){
		var rec = Hawk.gen('Record');

		rec.setId(123);
		expect(rec.getId()).toBe(123);
		rec.setId(222);
		expect(rec.getId()).toBe(222);
		rec.setId(444);
		expect(rec.getId()).toBe(444);

		expect(function(){rec.setId('notanumber')}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setId({})}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setId([])}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setId(null)}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setId(undefined)}).toThrow(new Hawk.NumberTypeError());

	});

	it('Record.getId: can get and set data', function(){
		var rec = Hawk.gen('Record');

		rec.setData({val:123});
		expect(rec.getData()).toBeDefined();
		expect(rec.getData().val).toBe(123);
		rec.setData({val:222});
		expect(rec.getData()).toBeDefined();
		expect(rec.getData().val).toBe(222);
		rec.setData({val:444});
		expect(rec.getData()).toBeDefined();
		expect(rec.getData().val).toBe(444);

		rec.setData({one:1, two: 2, three: 3});
		expect(rec.getData()).toBeDefined();
		expect(rec.getData().one).toBe(1);
		expect(rec.getData().two).toBe(2);
		expect(rec.getData().three).toBe(3);
	});

	it('Record.setDataIndex, Record.getDataIndex: can get and set dataIndex', function(){
		var rec = Hawk.gen('Record');

		rec.setDataIndex(123);
		expect(rec.getData()).toBeDefined();
		expect(rec.getDataIndex()).toBe(123);
		rec.setDataIndex(222);
		expect(rec.getDataIndex()).toBe(222);
		rec.setDataIndex(444);
		expect(rec.getDataIndex()).toBe(444);

		expect(function(){rec.setDataIndex('notanumber')}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setDataIndex({})}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setDataIndex([])}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setDataIndex(null)}).toThrow(new Hawk.NumberTypeError());
		expect(function(){rec.setDataIndex(undefined)}).toThrow(new Hawk.NumberTypeError());
	});	

	it('Record.set, Record.get: can get and set values in data', function(){
		var rec = Hawk.gen('Record');

		rec.set('one', 1);
		rec.set('two', 2);
		rec.set('three', 3);
		rec.set('arr', []);
		rec.set('obj', {});
		rec.set('empty', null);

		expect(rec.get('one')).toBe(1);
		expect(rec.get('two')).toBe(2);
		expect(rec.get('three')).toBe(3);
		expect(Array.isArray(rec.get('arr'))).toBe(true);
		expect(rec.get('arr').length).toBe(0);
		expect(rec.get('obj')).toBeDefined();
		expect(typeof rec.get('obj')).toBe('object');
		expect(rec.get('empty')).toBeNull();
	});

	it('Record.isDirty: gets marked with a dirty flag when values are set', function(){
		var rec = Hawk.gen('Record');

		expect(rec.isDirty()).toBe(false);
		rec.set('one', 1);
		rec.set('two', 2);
		expect(rec.isDirty()).toBe(true);
	});
});