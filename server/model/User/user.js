import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	refreshToken: { type: String }
})


userSchema.pre('save', async function () {
    if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10)
	}
})

userSchema.methods.comparePassword = function (candidate) {
	return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
