var mongoose = require("mongoose"),
	bcrypt = require("bcrypt-nodejs"),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	fullname: {
		type: String,
		trim: true,
		required: true
	},
	gender: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},
	hash_password: {
		type: String,
		required: true
	},
	position: {
		type: String,
		default: "User"
	},
	avatar_url: {
		type: String
	},
	description: {
		type: String
	},
	role: [
		{
			type: Schema.Types.ObjectId,
			ref: "Role"
		}
	],

	// addition
	location: {
		type: String,
		trim: true
	},
	graduation: {
		type: String,
		trim: true
	},
	department: {
		type: String,
		trim: true
	},
	job: {
		type: String,
		trim: true
	},
	skill: {
		type: String,
		trim: true
	},
	phone_number: {
		type: String,
		trim: true
	},
	birthday: {
		type: Date
	},

	create_at: {
		type: Date
	}
});

UserSchema.method.comparePassword = password => {
	return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model("User", UserSchema);
