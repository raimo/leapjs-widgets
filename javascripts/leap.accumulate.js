Leap.plugin('accumulate', function(scope){
  this.use('handHold');

  return {
    hand: {
      // note: to be accurate, this must be called
      accumulate: function(property, duration, callback) {
        var data = (this.data('accumulate.' + property) || []);
        var val = callback(data);

        if (data.length >= duration){
          data.shift();
        }

        this.data('accumulate.' + property, data);

        return val;
      }
    }
  }
});