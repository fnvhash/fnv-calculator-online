// thanks to https://nqv.github.io/fnv/
function FNV(bits, prime, offset) {
	var prime = bigInt(prime, 16);
	var offset = bigInt(offset, 16);
	var max = bigInt(2).pow(bits);

	var sum = function(data, add) {
		if (typeof data === 'string') {
			data = parseHexStr(data);
		}
		var h = bigInt(offset);
		for (var i = 0; i < data.length; i++) {
			h = add(h, data[i]).mod(max)
		}
		return h.toString(16);
	};

	this.sum1 = function(data) {
		return sum(data, function(h, c) {
			return h.multiply(prime).xor(c);
		});
	};

	this.sum1a = function(data) {
		return sum(data, function(h, c) {
			return h.xor(c).multiply(prime);
		});
	};
}

function parseHexStr(s) {
	s = s.replace(/[ \r\n]/g, '');
	if (s.length % 2 != 0) {
		s = '0' + s;
	}
	var r = [];
	while (s.length >= 2) { 
		r.push(parseInt(s.substring(0, 2), 16));
		s = s.substring(2);
	}
	return r;
}

function fnv(bits) {
	if (bits == 32) return new FNV(32, "1000193", "811C9DC5");
	if (bits == 64) return new FNV(64, "100000001B3", "CBF29CE484222325");
	if (bits == 128) return new FNV(128, "1000000000000000000013B", "6C62272E07BB014262B821756295C58D");
	if (bits == 256) return new FNV(256, "1000000000000000000000000000000000000000163", "DD268DBCAAC550362D98C384C4E576CCC8B1536847B6BBB31023B4C8CAEE0535")
	if (bits == 512) return new FNV(512, "100000000000000000000000000000000000000000000000000000000000000000000000000000000000157", "B86DB0B1171F4416DCA1E50F309990ACAC87D059C90000000000000000000D21E948F68A34C192F62EA79BC942DBE7CE182036415F56E34BAC982AAC4AFE9FD9");
	if (bits == 1024) return new FNV(1024, "10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018D", "0000000000000000005F7A76758ECC4D32E56D5A591028B74B29FC4223FDADA16C3BF34EDA3674DA9A21D9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004C6D7EB6E73802734510A555F256CC005AE556BDE8CC9C6A93B21AFF4B16C71EE90B3");
}
