var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FileUploadSchema = new Schema({
	path: {
		type: String,
		require
	},
	size: {
		type: Number,
		require
	},
	mimetype: {
		type: String
	},
	originalname: {
		type: String,
		require
	},
	encoding: {
		type: String,
		require
	},
	filename: {
		type: String,
		require
	},
	is_used: {
		type: Boolean,
		default: false
	},
	create_date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model("FileUpload", FileUploadSchema);
