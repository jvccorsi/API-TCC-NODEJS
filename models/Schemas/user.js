//IMPORT
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  passwordResetToken: { type: String, select: false },
  passwordResetExpiress: { type: Date, select: false },
  fichas: [{ type: mongoose.Types.ObjectId, required: true, ref: 'tccFichas' }],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
