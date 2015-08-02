(function(global) {
  global.tr = HexInputHandler();
global.mustUpdateStr = false;
global.inhibitHex = false;
global.bitsize = 64;
function printHash(bignum) {
    var r = bignum.toRadix(16);
    while (r.length < bitsize / 4) {
      r = '0' + r;
    }
    var lineWidth = 64;
    var s = [ ];
    var lineCount = Math.floor(r.length / lineWidth)
    if (lineCount < 1) {
      lineCount = 1;
    }
    for (var i = 0; i < lineCount; ++i) {
      s.push(r.substring(i*lineWidth,(i+1)*lineWidth))
    }
    s =  s.join("<br />")
    return s;
}
global.cancelit2 = function(event) {
  if (event.keyCode == 86) {
    return true;
  }
  return false;
}

global.cancelit = function(event) {
  return true;
}

var fnv = FNV();
function handlePaste(event) {
  var str = event.clipboardData.getData('text/plain');
  convertFromHexString(str);
  mustUpdateStr = true;
  updateDisplayFromHex();
  return false;
}


function convertFromString(str) {
  mustUpdateStr = false;
  tr.translateKeypress(27);
  for (var i = 0; i < str.length; ++i) {
    var c = new BigInteger(''+str.charCodeAt(i), 10);
    var hex = c.toRadix(16);
    tr.translateKeypress(hex.charCodeAt(0));
    tr.translateKeypress(hex.charCodeAt(1));
  }
}

function convertFromHexString(str) {
  str = str.replace(/[ \r\n]/g ,'');
  tr.translateKeypress(27);
  for (var i = 0; i < str.length; ++i) {
    tr.translateKeypress(str.charCodeAt(i));
  }
}

function updateDisplayFromHex() {
  if (inhibitHex) {
    return;
  }
  var str = tr.displayString();
  inhibitHex = true;
  document.getElementById("input_hex").value = str;
  if (mustUpdateStr) {
    document.getElementById("input_str").value = tr.toScalarString();
  }
  inhibitHex = false;
  var h = fnv.hashFNV1aBuf(tr.toScalarArray(), bitsize);
  document.getElementById("output_hash_1a").innerHTML = printHash(h);
  var h = fnv.hashFNV1Buf(tr.toScalarArray(), bitsize);
  document.getElementById("output_hash_1").innerHTML = printHash(h);
}
global.handleStringPaste = function(event) {
  var str = event.clipboardData.getData('text/plain');
  mustUpdateStr = false;
  convertFromString(str);
  updateDisplayFromHex();
}

function translateStringKeypress(event) {
  var c = event.keyCode;
  var str = document.getElementById("input_str").value;
  mustUpdateStr = false;
  convertFromString(str);
  updateDisplayFromHex();
  return false;
}
global.translateHexKeypress = function(event) {
  var c = event.keyCode;
  mustUpdateStr = true;
  tr.translateKeypress(c);
  updateDisplayFromHex();
  return false;
}
global.bitselected = function(howmany) {
  bitsize = howmany;
  updateDisplayFromHex();
}
function gotChange(arr) {
  tr.acceptBytes(arr);
  mustUpdateStr = false;
  updateDisplayFromHex();
}
global.dostuff = function() {
  var ism = InputStringModel();
  ism.watchForChanges(gotChange);
}
})(this);
