function DataSource(data = []) {
  this.data = data;
}

DataSource.prototype.add = function(data) {
  this.data.push(data);
};

DataSource.prototype.addAll = function(data) {
  this.data = this.data.concat(data);
};

DataSource.prototype.isEmpty = function() {
  return this.data.length === 0;
};

export default DataSource;
