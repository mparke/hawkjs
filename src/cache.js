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
