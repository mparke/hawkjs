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
