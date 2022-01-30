const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

class User {
	name = '';
	email = '';
	address = '';
	password = '';
	passwordConfirm = '';
	/** @type {'admin'|'user'} */
	role = '';
	active = true;

	static getModelSchema() {
		return {
			name: { type: String, required: [true, "Please fill your name"] },
			address: { type: String, trim: true },
			email: {
				type: String,
				required: [true, "Please fill your email"],
				unique: true,
				lowercase: true,
				validate: [validator.isEmail, " Please provide a valid email"],
			},
			password: {
				type: String,
				required: [true, "Please fill your password"],
				minLength: 6,
				select: false,
			},
			passwordConfirm: {
				type: String,
				required: [true, "Please fill your password confirm"],
				validate: {
					validator: function (el) {
						// "this" works only on create and save
						return el === this.password;
					},
					message: "Your password and confirmation password are not the same",
				},
			},
			role: {
				type: String,
				enum: ["admin", "teacher", "student"],
				default: "student",
			},
			active: {
				type: Boolean,
				default: true,
				select: false,
			},
		};
	}

	/**
	 * @async
	 * @param  {string} typedPassword
	 * @param  {string} originalPassword
	 */
	static async isCorrectPassword(typedPassword, originalPassword) {
		return await bcrypt.compare(typedPassword, originalPassword);
	}
}

/** @type {mongoose.Schema<User, User>} */
const userSchema = new mongoose.Schema(User.getModelSchema());

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
userSchema.pre("save", async function (next) {
	// check the password if it is modified
	if (!this.isModified("password")) return next();
	// Hashing the password
	this.password = await bcrypt.hash(this.password, 12);
	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = User.isCorrectPassword;

const UserModel = mongoose.model("User", userSchema);
module.exports = { User, UserModel };


// "user": {
//		"name": "Martin"
// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjY5MWZiYWQwYWM4MTIzNWZkNDExOCIsImlhdCI6MTY0MzU0OTE4MCwiZXhwIjoxNjQzNTQ5MTgwfQ.33eNGegjqSwobLg89kJwvVX5G97sao5kldfPF3wpnKw",
// 		"data": {
// 		"user": {
// 			"role": "admin",
// 				"active": true,
// 					"_id": "61f691fbad0ac81235fd4118",
// 						"name": "Martin",
// 							"email": "mar10_emil@yahoo.com",
// 								"__v": 0;
// 		}
// 	}
// }