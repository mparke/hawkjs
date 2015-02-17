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
