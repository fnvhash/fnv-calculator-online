(function(global) {
  global.InputStringModel = function() {
    var that = { };
    var input_name = 'input_str';
    var getBytes = function(str) {
      var bytes = [], ch;
      str = encodeURI(str);

      while (str.length) {
        ch = str.slice(0, 1);
        str = str.slice(1);

        if ('%' !== ch) {
          bytes.push(ch.charCodeAt(0));
        } else {
          ch = str.slice(0, 2);
          str = str.slice(2);

          bytes.push(parseInt(ch, 16));
        }
      }
      return bytes;
    };
    that.toScalarArray = function() {
      return getBytes(document.getElementById("input_str").value);
    };
    that.fromScalarArray = function(bytes) {
      var buff = new Buffer(bytes);
      return buff.toString("utf8");
    };
    that.watchForChanges = function(callback) {
      var input_elem = document.getElementById("input_str");
      var last_str;
      var first_str = document.getElementById("input_str").value;
      var delay_loop = function() {
        var next_str = document.getElementById("input_str").value;
        if (first_str === next_str) {
          if (last_str !== next_str) {
            callback(that.toScalarArray());
            last_str = first_str;
          }
        } else {
          setTimeout(delay_loop, 30);
          first_str = next_str;
        }
      };
      input_elem.onkeydown = delay_loop;
      input_elem.onkeypress = delay_loop;
      input_elem.onkeyup = delay_loop;
    }
    return that;
  };
})(this);
