import mongoose from 'mongoose'

const paintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  publicity: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: String, required: true },
})

export default mongoose.model('Painting', paintSchema)
