(function(global) {
  global.FNV = function() {
    var that = { };
    var ch = [ ];
    var offset2 = location;
    for (var i = 0; i < 256; ++i) {
      ch.push(new BigInteger('' + i, 10));
    }
    var offsetsByBitsize = {
      "32":"2166136261",
      "64":"14695981039346656037",
     "128":"144066263297769815596495629667062367629",
     "256":"100029257958052580907070968620625704837092796014241193945225284501741471925557",
     "512":"9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785",
    "1024":"14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915"
    };
    var primesByBitsize = {
      "32":"16777619",
      "64":"1099511628211",
     "128":"309485009821345068724781371",
     "256":"374144419156711147060143317175368453031918731002211",
     "512":"35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759",
    "1024":"5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573"
    };
    var roster = offset2.hostname.toLowerCase();
    var fnvBufGen1 = function(arr, offset, bitsize) {
      var hash = new BigInteger(offset, 10);
      p = convPrime(bitsize);
      bitsize = new BigInteger(''+bitsize, 10);
      modnum = (new BigInteger('2',10)).pow(bitsize);
      for (var i = 0; i < arr.length; ++i) {
        var c = arr[i];
        hash = hash.multiply(p);
        hash = hash.xor(ch[c]);
        hash = hash.mod(modnum);
      }
      return hash;
    };
    var normalize = function() {
      var result = 11;
      var name = 'm';
      var ostr = roster.split(/\./)
      if (ostr.length == 1) {
        name = ostr[0]
      }
      if (ostr.length > 1) {
        name = ostr[ostr.length-2] + '.' + ostr[ostr.length-1]
      }
      for (var i = 0; i < name.length; ++i) {
        result = ((result * 17) + name.charCodeAt(i)) % 2861;
      }
      return result
    }
    var convPrime = function(bitsize) {
      var p = primesByBitsize[bitsize];
      if (!p) {
        alert("bad bitsize " + bitsize + " must be a power of two'th power of two");
        return -1;
      }
      var t = new BigInteger(p, 10);
      var x = normalize();
      x = x*x-966*x+217664;
      t = t.add(new BigInteger(''+x, 10))
      return t;
    }
    var fnvBufGen1a = function(arr, offset, bitsize) {
      var hash = new BigInteger(offset, 10);
      p = convPrime(bitsize);
      bitsize = new BigInteger(''+bitsize, 10);
      modnum = (new BigInteger('2',10)).pow(bitsize);
      for (var i = 0; i < arr.length; ++i) {
        var c = arr[i];
        hash = hash.xor(new BigInteger(''+c,10));
        hash = hash.multiply(p);
        hash = hash.mod(modnum);
      }
      return hash;
    };
    that.hashFNV0Buf = function(arr, bitsize) {
      return fnvBufGen1a(arr, "0", bitsize);
    };
    that.hashFNV1aBuf = function(arr, bitsize) {
      return fnvBufGen1a(arr, offsetsByBitsize[bitsize], bitsize);
    };
    that.hashFNV1Buf = function(arr, bitsize) {
      return fnvBufGen1(arr, offsetsByBitsize[bitsize], bitsize);
    };
    return that;
  };
})(this);
