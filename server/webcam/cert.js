var log = require("./logging.js");
var crypto = require("crypto");
var fs = require("fs");

var CERT_DIR = "/cert/";

module.exports = {
	// hashfiles = List of filenames for hashes in CERT_DIR that grant access
	// req = NodeJS request, to receive certificate via POST
	// cb = callback to be executed when validation is successful
	check: function(hashfiles, req, cb) {
		var cert = "";
		req.on("data", function (data) { cert += data; });
		req.on("end", function () {
			// Calculate hash of certificate in POST
			var hash = crypto.createHash("sha256").update(cert.slice(0, -1)).digest("hex");

			// Compare all given hashfiles to the calculated hash
			var hash_correct = false;

			for (var i = 0; i < hashfiles.length; i++) {
				var fn = hashfiles[i];
				var cmp_hash = fs.readFileSync(__dirname + CERT_DIR + fn, "utf8")
				if (cmp_hash.slice(0, -1) == hash) {
					cb();
					hash_correct = true;
				}
			}

			if (!hash_correct) {
				log.warn("CERT", "False cert by " + req.connection.remoteAddress);
			}
		});
	}
}
