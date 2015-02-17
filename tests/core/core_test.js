describe('Core', function(){

	it('has default properties.', function(){
		expect(Hawk.classMap).toBeDefined();
		expect(Hawk.mixinMap).toBeDefined();
	});

	it('Hawk.getDef: can get a class definition.', function(){
		Hawk.def('falcon',{
			one: function(){
				return 1;
			},
			two: function(){
				return 2;
			}
		});
		Hawk.def('eagle', {
			three: function(){
				return 3;
			},
			four: function(){
				return 4;
			}
		});

		var falconDef = Hawk.getDef('falcon');
		var eagleDef = Hawk.getDef('eagle');

		expect(falconDef).toBeDefined();
		expect(falconDef.initQueue).toBeDefined();
		expect(falconDef.sprout).toBeDefined();
		expect(falconDef.sprout.prototype.one()).toBe(1);
		expect(falconDef.sprout.prototype.two()).toBe(2);

		expect(eagleDef).toBeDefined();
		expect(eagleDef.initQueue).toBeDefined();
		expect(eagleDef.sprout).toBeDefined();
		expect(eagleDef.sprout.prototype.three()).toBe(3);
		expect(eagleDef.sprout.prototype.four()).toBe(4);
	});

	it('Hawk.getDefs: can get multiple class definitions.', function(){
		var defs = Hawk.getDefs(['falcon', 'eagle']);

		expect(defs[0]).toBeDefined();
		expect(defs[0].initQueue).toBeDefined();
		expect(defs[0].sprout).toBeDefined();
		expect(defs[0].sprout.prototype.one()).toBe(1);
		expect(defs[0].sprout.prototype.two()).toBe(2);

		expect(defs[1]).toBeDefined();
		expect(defs[1].initQueue).toBeDefined();
		expect(defs[1].sprout).toBeDefined();
		expect(defs[1].sprout.prototype.three()).toBe(3);
		expect(defs[1].sprout.prototype.four()).toBe(4);
	});

	it('Hawk.DoesNotExistException: has a class DoesNotExistException.', function(){
		var doesNotExistException = new Hawk.DoesNotExistException('hello');
		
		expect(doesNotExistException).toBeDefined();
		expect(doesNotExistException.value).toBe('hello');
		expect(doesNotExistException.message).toBe('definition does not exist.');
		expect(doesNotExistException.toString()).toBe('hello definition does not exist.');
	});

	it('Hawk.NumberTypeError: has a class NumberTypeError', function(){
		var numberTypeError = new Hawk.NumberTypeError('hello');

		expect(numberTypeError).toBeDefined();
		expect(numberTypeError.value).toBe('hello');
		expect(numberTypeError.message).toBe('must be a number.');
		expect(numberTypeError.toString()).toBe('hello must be a number.');
	});

	it('Hawk.ObjectTypeError: has a class ObjectTypeError', function(){
		var objectTypeError = new Hawk.ObjectTypeError('hello');

		expect(objectTypeError).toBeDefined();
		expect(objectTypeError.value).toBe('hello');
		expect(objectTypeError.message).toBe('must be an object.');
		expect(objectTypeError.toString()).toBe('hello must be an object.');
	});

	it('Hawk.IndexOutOfBoundsException: has a class IndexOutOfBoundsException', function(){
		var indexOutOfBoundsException = new Hawk.IndexOutOfBoundsException('hello');

		expect(indexOutOfBoundsException).toBeDefined();
		expect(indexOutOfBoundsException.value).toBe('hello');
		expect(indexOutOfBoundsException.message).toBe('is out of bounds.');
		expect(indexOutOfBoundsException.toString()).toBe('hello is out of bounds.');
	});

	it('Hawk.mix: can mix class definitions into a new definition.', function(){
		Hawk.def('Firstmixin',{ 
			phrase: 'hello first',
			init: function(){
				return 400;
			},
			firstaction: function(){
				return 10;
			}
		});

		Hawk.def('Secondmixin',{ 
			mixins: [
				'Firstmixin'
			],
			
			message: 'hello second',
			init: function(){
				return 500;
			}, 
			secondaction: function(){
				return 20;
			}
		});

		var classDef = Hawk.getDef('Secondmixin');
		var sprout = classDef.sprout;
		var initQueue = classDef.initQueue;

		expect(sprout.prototype.phrase).toBe('hello first');
		expect(sprout.prototype.message).toBe('hello second');
		expect(sprout.prototype.firstaction()).toBe(10);
		expect(sprout.prototype.secondaction()).toBe(20);
		expect(initQueue.length).toBe(2);
		expect(initQueue[0]()).toBe(500);
		expect(initQueue[1]()).toBe(400);
	});

	it('Hawk.def: can define a new class', function(){
		Hawk.def('Experimental',{
			one:1, 
			two:'hello world',
			init: function(){
				return 10;
			},
			config:{val:200},
			configArr: [1, 2, 3]
		});

		//test definition
		expect(Hawk.getDef('Experimental')).toBeDefined();
		expect(Hawk.classMap['Experimental']).toBeDefined();
		expect(Hawk.classMap['Experimental'].initQueue).toBeDefined();
		expect(Hawk.classMap['Experimental'].sprout).toBeDefined();
		expect(Hawk.classMap['Experimental'].initQueue[0]()).toBe(10);
		expect(Hawk.classMap['Experimental'].sprout.prototype.one).toBe(1);
		expect(Hawk.classMap['Experimental'].sprout.prototype.two).toBe('hello world');
		expect(Hawk.classMap['Experimental'].sprout.prototype.config.val).toBe(200);
		expect(Hawk.classMap['Experimental'].sprout.prototype.configArr[0]).toBe(1);
	});

	it('Hawk.gen: can generate a class instance', function(){
		var exp = Hawk.gen('Experimental');

		expect(exp).toBeDefined();
		expect(exp.one).toBe(1);
		expect(exp.two).toBe('hello world');
		expect(exp.config.val).toBe(200);
		expect(exp.configArr[0]).toBe(1);
	});

	it('identifies an instance with the instanceof operator', function(){
		var exp = Hawk.gen('Experimental');

		expect(exp instanceof Hawk.getDef('Experimental').sprout).toBe(true);
	});

	it('Hawk.gen: can generate a class instance with mixins', function(){
		Hawk.def('ReturnTen',{ 
			init:function(){
				this.fromTenName = 'ReturnTen';
			},
			getTen: function(){
				return 10;
			}
		});

		Hawk.def('ReturnTwenty',{
			init: function(){
				this.fromTwentyName = 'ReturnTwenty';
			},	
			getTwenty: function(){
				return 20;
			}
		});

		Hawk.def('ReturnThirty',{
			init: function(){
				this.fromThirtyName = 'ReturnThirty';
			},
			getThirty: function(){
				return 30;
			}
		});

		Hawk.def('Numbers',{
			mixins: [
				'ReturnTen',
				'ReturnTwenty',
				'ReturnThirty'
			],

			init: function(){
				this.fromNumbersName = 'Numbers';
			},

			getFourty: function(){
				return 40;
			}
		});

		var numbersPlain = Hawk.gen('Numbers');

		expect(numbersPlain).toBeDefined();
		expect(numbersPlain.fromTenName).toBe('ReturnTen');
		expect(numbersPlain.fromTwentyName).toBe('ReturnTwenty');
		expect(numbersPlain.fromThirtyName).toBe('ReturnThirty');
		expect(numbersPlain.fromNumbersName).toBe('Numbers');
		expect(numbersPlain.getTen()).toBe(10);
		expect(numbersPlain.getTwenty()).toBe(20);
		expect(numbersPlain.getThirty()).toBe(30);
		expect(numbersPlain.getFourty()).toBe(40);
	});

	it('Hawk.gen: can generate a class instance with mixins and overrides', function(){

		var numbersOverride = Hawk.gen('Numbers',{
			overrideName: 'OverrideNumbers',

			getFifty: function(){return 50;},
			getTen: function(){return null;},
			getTwenty: function(){return null;},
			getThirty: function(){return null;},
			getFourty: function(){return null}
		});

		expect(numbersOverride).toBeDefined();
		expect(numbersOverride.overrideName).toBe('OverrideNumbers');
		expect(numbersOverride.getFifty()).toBe(50);
		expect(numbersOverride.getTen()).toBeNull();
		expect(numbersOverride.getTwenty()).toBeNull();
		expect(numbersOverride.getThirty()).toBeNull();
		expect(numbersOverride.getFourty()).toBeNull();
	});

});