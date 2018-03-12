const stringMapping = [
  ['`', '\''], ['’', '\'']];

export default {
  initialize: function() {
    String.prototype.normalize = function() {
      let s = this.toLowerCase();
      
      stringMapping.forEach(x => {
        s = s.replace(x[0], x[1]);
      });
      
      s = encodeURIComponent(s);
      return s;
    };
    
    String.prototype.variations = function() {
      let s = this.normalize();
      s = decodeURIComponent(s);
      let d = [s];
      
      stringMapping.forEach(x => {
        d.push(s.replace(x[1], x[0]));
      });
      
      return [...new Set(d)];
    };
  },
};
