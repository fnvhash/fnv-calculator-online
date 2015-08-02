(function(global) {
  global.HexInputHandler = function() {
    var that = { };
    var curBinary = [ ];
    var curNibble = undefined;
    var curSpace = undefined;
    var doDigit = function(c) {
      if (curNibble === undefined) {
        curNibble = c;
        curSpace = undefined;
      } else {
        var hexy = String.fromCharCode(curNibble) + String.fromCharCode(c);
        curBinary.push(hexy);
        curNibble = undefined;
      }
    };
    that.acceptBytes = function(bytes) {
      curBinary.length = 0;
      mustUpdateStr = false;
      tr.translateKeypress(27);
      for (var i = 0; i < bytes.length; ++i) {
        var c = new BigInteger(''+bytes[i], 10);
        var hex = c.toRadix(16);
        tr.translateKeypress(hex.charCodeAt(0));
        tr.translateKeypress(hex.charCodeAt(1));
      }
    };
    var doClear = function() {
      curNibble = undefined;
      curBinary.length = 0;
      curSpace = undefined;
    };
    var doBackspace = function() {
      if (curSpace) {
        curSpace = undefined;
        return;
      }
      if (curNibble === undefined) {
        var topElem = curBinary.pop();
        if (topElem === undefined) {
          return;
        }
        curNibble = topElem.charCodeAt(0);
      } else {
        curNibble = undefined;
      }
    };
    var doFinish = function() {
      that.finishString();
    }
    var doSpace = function() {
      if (curSpace) {
        return;
      }
      if (curNibble) {
        return;
      }
      curSpace = true;
    };
    that.displayString = function() {
      var firstPart = curBinary.join(' ');
      var preSpace = curBinary.length > 0 ? ' ' : '';
      var nextPart = curNibble ? preSpace + String.fromCharCode(curNibble) : '';
      var lastSpace = (curNibble || !curSpace) ? '' : ' ';
      return firstPart + nextPart + lastSpace;
    };
    that.toScalarString = function() {
      var sa = that.toScalarArray();
      var a = [ ];
      for (var i = 0; i < sa.length; ++i) {
        a.push(String.fromCharCode(sa[i]));
      }
      return a.join('');
    };
    that.toScalarArray = function() {
      var str = that.displayString();
      str = str.replace(/ /g ,'');
      var result = [ ];
      for (var i = 0;i < str.length/2; ++i) {
        var hex = str.substring(2*i, 2*i+2);
        result.push(parseInt(hex, 16));
      }
      return result;
    };
    that.finishString = function() {
      if (curNibble) {
        that.translateKeypress(8);
      }
    };
    that.translateKeypress = function(c) {
      if (c == 110 || c == 37 || c == 46) {
        c = 8;
      }
      if (c == 13) {
        doFinish();
      }
      if (c >= 65 && c < 65+26) {
        c += 32;
      }

      if (c == 8) {
        doBackspace();
      }
      if (c == 27) {
        doClear();
      }
      if (c == 32) {
        doSpace();
      }
      if ((c >= 0x30 && c <= 0x39) ||
          (c >= 97 && c < 97+6)) {
        doDigit(c);
      }
      return c;
    };
    return that;
  };
})(this);
