const mongoose = require('mongoose')
// const mongodb = require('mongodb')

const today = new Date()

const currentYear = today.getFullYear().toString()
const currentMonth = (today.getMonth() + 1).toString()
const currentDate = today.getDate()

const UserSchema = new mongoose.Schema(
  {
    // userid: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      index: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      index: true,
      unique: true
    },
    bio: {
      type: String,
      default: ''
    },
    // image: { type: String, default: '' },
    dates: {
      type: Object,
      default: {
        [currentYear]: {
          dateRange: {
            startDate: `${currentYear}-01-01`,
            endDate: `${currentYear}-12-31`
          },
          items: [
            {
              index: 1,
              date: `${currentYear}/${currentMonth}/${currentDate}`,
              count: 0
            }
          ]
        }
      }
    },
    entries: {
      type: mongoose.Schema.Types.Array,
      default: []
    },
    hash: String,
    joinedOn: {
      type: Date,
      default: Date.now
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
