export default {
  initialize: function() {
    String.prototype.normalize = function() {
      let s = this.toLowerCase();
      s = s.replace('’', '\'');
      s = s.replace('`', '\'');
      s = encodeURIComponent(s);
      return s;
    };
  },
};
