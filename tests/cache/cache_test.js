describe('Cache', function(){
	
	it('can be instantiated with defaults.', function(){
		var cache = Hawk.gen('Cache');

		expect(cache).toBeDefined();
		expect(cache.store).toBeDefined();
		expect(Array.isArray(cache.store)).toBe(true);
		expect(cache.recCounter).toBe(0);
	});

	it('Cache.add: can add a data object.', function(){
		var cache = Hawk.gen('Cache');

		expect(cache).toBeDefined();

		cache.add({val:10});
		cache.add({val:20});
		cache.add({val:30});
		cache.add({val:40});
		cache.add({val:50});

		expect(cache.store[0].getData().val).toBe(10);
		expect(cache.store[0].getId()).toBe(0);
		expect(cache.store[1].getData().val).toBe(20);
		expect(cache.store[1].getId()).toBe(1);
		expect(cache.store[2].getData().val).toBe(30);
		expect(cache.store[2].getId()).toBe(2);
		expect(cache.store[3].getData().val).toBe(40);
		expect(cache.store[3].getId()).toBe(3);
		expect(cache.store[4].getData().val).toBe(50);
		expect(cache.store[4].getId()).toBe(4);
	});

	it('Cache.load: can load an array of data objects.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10},
			{val: 20},
			{val: 30},
			{val: 40},
			{val: 50}
		]);

		expect(cache.store[0].getData().val).toBe(10);
		expect(cache.store[0].getId()).toBe(0);
		expect(cache.store[1].getData().val).toBe(20);
		expect(cache.store[1].getId()).toBe(1);
		expect(cache.store[2].getData().val).toBe(30);
		expect(cache.store[2].getId()).toBe(2);
		expect(cache.store[3].getData().val).toBe(40);
		expect(cache.store[3].getId()).toBe(3);
		expect(cache.store[4].getData().val).toBe(50);
		expect(cache.store[4].getId()).toBe(4);
	});
	
	it('Cache.size: can return size.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10},
			{val: 20},
			{val: 30},
			{val: 40},
			{val: 50}
		]);

		expect(cache.size()).toBe(5);
		cache.add({val:100});
		expect(cache.size()).toBe(6);
		cache.add({val:200});
		expect(cache.size()).toBe(7);
	});

	it('Cache.remove can remove and return record objects.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		//remove from beginning
		var firstRec = cache.remove(cache.store[0]);
		expect(firstRec).toBeDefined();
		expect(firstRec.getData().val).toBe(10);
		expect(firstRec.getData().word).toBe('the');
		expect(cache.store[0].getData().val).toBe(20);
		expect(cache.store[0].getData().word).toBe('quick');
		expect(cache.size()).toBe(8)

		//remove from end
		var secondRec = cache.remove(cache.store[7]);
		expect(secondRec).toBeDefined();
		expect(secondRec.getData().val).toBe(90);
		expect(secondRec.getData().word).toBe('dog');
		expect(cache.store[6].getData().val).toBe(80);
		expect(cache.store[6].getData().word).toBe('lazy');
		expect(cache.size()).toBe(7);

		//remove from middle
		var thirdRec = cache.remove(cache.store[3]);
		expect(thirdRec).toBeDefined();
		expect(thirdRec.getData().val).toBe(50);
		expect(thirdRec.getData().word).toBe('jumps');
		expect(cache.store[3].getData().val).toBe(60);
		expect(cache.store[3].getData().word).toBe('over');
		expect(cache.size()).toBe(6);
	});

	it('Cache.removeAt: can remove a record at an index.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		//remove from the beginning
		var firstRec = cache.removeAt(0);
		expect(firstRec).toBeDefined();
		expect(firstRec.getData().val).toBe(10);
		expect(firstRec.getData().word).toBe('the');
		expect(cache.store[0].getData().val).toBe(20);
		expect(cache.store[0].getData().word).toBe('quick');
		expect(cache.size()).toBe(8);

		//remove from end
		var secondRec = cache.removeAt(7);
		expect(secondRec).toBeDefined();
		expect(secondRec.getData().val).toBe(90);
		expect(secondRec.getData().word).toBe('dog');
		expect(cache.store[6].getData().val).toBe(80);
		expect(cache.store[6].getData().word).toBe('lazy');
		expect(cache.size()).toBe(7);

		//remove from middle
		var thirdRec = cache.removeAt(3);
		expect(thirdRec).toBeDefined();
		expect(thirdRec.getData().val).toBe(50);
		expect(thirdRec.getData().word).toBe('jumps');
		expect(cache.store[3].getData().val).toBe(60);
		expect(cache.store[3].getData().word).toBe('over');
		expect(cache.size()).toBe(6);
	});

	it('Cache.removeAll: can remove and return all records.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		var records = cache.removeAll();
		expect(records).toBeDefined();
		expect(records.length).toBe(9);
		expect(records[0].getData().val).toBe(10);
		expect(records[0].getData().word).toBe('the');
		expect(records[8].getData().val).toBe(90);
		expect(records[8].getData().word).toBe('dog');

		expect(cache.size()).toBe(0);
		expect(cache.store.length).toBe(0);
		expect(cache.recCounter).toBe(0);
		expect(cache.idCounter).toBe(0);
	});

	it('Cache.indexOf: can find and return the index of a record', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		expect(cache.indexOf(cache.store[0])).toBe(0);
		expect(cache.indexOf(cache.store[1])).toBe(1);
		expect(cache.indexOf(cache.store[2])).toBe(2);
		expect(cache.indexOf(cache.store[3])).toBe(3);
		expect(cache.indexOf(cache.store[4])).toBe(4);
		expect(cache.indexOf(cache.store[5])).toBe(5);
		expect(cache.indexOf(cache.store[6])).toBe(6);
		expect(cache.indexOf(cache.store[7])).toBe(7);
		expect(cache.indexOf(cache.store[8])).toBe(8);
	});

	it('Cache.getAt: can get a record at a given index', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		expect(cache.getAt(0).getData().val).toBe(10);
		expect(cache.getAt(1).getData().val).toBe(20);
		expect(cache.getAt(2).getData().val).toBe(30);
		expect(cache.getAt(3).getData().val).toBe(40);
		expect(cache.getAt(4).getData().val).toBe(50);
		expect(cache.getAt(5).getData().val).toBe(60);
		expect(cache.getAt(6).getData().val).toBe(70);
		expect(cache.getAt(7).getData().val).toBe(80);
		expect(cache.getAt(8).getData().val).toBe(90);
	});

	it('Cache.getRecords: can get and return all records', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'},
			{val: 70, word: 'the'},
			{val: 80, word: 'lazy'},
			{val: 90, word: 'dog'},
		]);

		expect(cache.size()).toBe(9);

		var records = cache.getRecords();
		expect(records).toBeDefined();
		expect(Array.isArray(records)).toBe(true);
		expect(records.length).toBe(9);
		expect(records[0].getData().val).toBe(10);
		expect(records[1].getData().val).toBe(20);
		expect(records[2].getData().val).toBe(30);
		expect(records[3].getData().val).toBe(40);
		expect(records[4].getData().val).toBe(50);
		expect(records[5].getData().val).toBe(60);
		expect(records[6].getData().val).toBe(70);
		expect(records[7].getData().val).toBe(80);
		expect(records[8].getData().val).toBe(90);
	});

	it('Cache.find: can find a record by key + value', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'}
		]);

		expect(cache.size()).toBe(6);

		expect(cache.find('val', 10)).toBeDefined();
		expect(cache.find('val', 10).getData().val).toBe(10);
		expect(cache.find('word', 'the')).toBeDefined();
		expect(cache.find('word', 'the').getData().word).toBe('the');

		expect(cache.find('val', 40)).toBeDefined();
		expect(cache.find('val', 40).getData().val).toBe(40);
		expect(cache.find('word', 'fox')).toBeDefined();
		expect(cache.find('word', 'fox').getData().word).toBe('fox');

		expect(cache.find('val', 60)).toBeDefined();
		expect(cache.find('val', 60).getData().val).toBe(60);
		expect(cache.find('word', 'over')).toBeDefined();
		expect(cache.find('word', 'over').getData().word).toBe('over');
	});

	it('Cache.getDirty: can get and return all records that have been altered since added.', function(){
		var cache = Hawk.gen('Cache');
		expect(cache).toBeDefined();

		cache.load([
			{val: 10, word: 'the'},
			{val: 20, word: 'quick'},
			{val: 30, word: 'brown'},
			{val: 40, word: 'fox'},
			{val: 50, word: 'jumps'},
			{val: 60, word: 'over'}
		]);

		expect(cache.size()).toBe(6);
		
		cache.getAt(0).set('val', 100);
		cache.getAt(5).set('val', 600);

		expect(cache.getDirty()).toBeDefined();
		expect(cache.getDirty().length).toBe(2);
		expect(cache.getDirty()[0].getData().val).toBe(100);
		expect(cache.getDirty()[1].getData().val).toBe(600);
	});

});