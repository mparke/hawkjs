/**
*   Linked List
*   [Doubly Linked](http://en.wikipedia.org/wiki/Doubly_linked_list)
*/
Hawk.def('LinkedList', {

  // Initialze the doubly linked list
  init: function () {
    this.start = Hawk.gen('Node',{
    	id:null,
    	data:null
    });

    this.end = Hawk.gen('Node',{
    	id:null,
    	data:null
    });

    this.start.next = this.end;
    this.start.prev = null;
    this.end.prev = this.start;
    this.end.next = null;

    this.idCounter = 0;
    this.numNodes = 0;
  },

  // Add to the end of the list
  add: function (data) {
    this.addLast(data);
  },

  // Add to the end of the list
  addLast: function (data) {
    var node = Hawk.gen('Node',{
      id: this.idCounter,
      data: data
    });

    last = this.end;

    this.insertBefore(last, node);

    ++this.idCounter;
    ++this.numNodes;
  },

  // Insert before a given node in the list
  insertBefore: function (toInsertBefore, node) {
    node.next = toInsertBefore;
    node.prev = toInsertBefore.prev;

    toInsertBefore.prev.next = node;
    toInsertBefore.prev = node;
  },

  // Get the first node in the list
  getFirst: function () {
    if (this.numNodes === 0) {
      return null;
    } else {
      return this.start.next;
    }
  },

  // Get the last node in the list
  getLast: function () {
    if (this.numNodes === 0) {
      return null;
    } else {
      return this.end.prev;
    }
  },

  // Finds and returns the node at the specified index, starting at the beginning of the list
  getFromFirst: function (index) {
    var count = 0,
      temp = this.start.next;

    if(index >= 0){
      while (count < index && temp !== null) {
        temp = temp.next;
        ++count;
      }
    }else{
      temp = null;
    }

    if(temp === null){
      throw new Hawk.IndexOutOfBoundsException(index);
    }

    return temp;
  },

  // Gets a node at the specific index
  getAt: function (index) {
    var count = 0,
      temp = null;

    if (index === 0) {
      temp = this.getFirst();
    } else if (index === this.numNodes - 1) {
      temp = this.getLast();
    } else {
      temp = this.getFromFirst(index);
    }

    return temp;
  },

  // Gets the size of the list
  size: function () {
    return this.numNodes;
  },

  // Remove and return a node from the list
  remove: function (node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    --this.numNodes;

    return node;
  },

  // Remove the first node in the list
  removeFirst: function () {
    var temp = null;

    if (this.numNodes > 0) {
      temp = this.remove(this.start.next);
    }

    return temp;
  },

  // Remove the last node from the list
  removeLast: function () {
    var temp = null;

    if (this.numNodes > 0) {
      temp = this.remove(this.end.prev);
    }

    return temp;
  },

  // Remove all nodes from the list
  removeAll: function(){
    this.start.next = this.end;
    this.end.prev = this.start;
    this.numNodes = 0;
  }
});
