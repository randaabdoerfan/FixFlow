const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true },
    confirmPassword: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', "agent", 'user'],
      default: 'user',
    },
    socketId: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    phone: {
      type: String,
      match: [/^(01)[0-2,5]{1}[0-9]{8}$/, 'Please provide a valid phone number'],
      default: null
    },
    avatar: { type: String, default: "https://res.cloudinary.com/dngkblgyf/image/upload/ar_1:1,c_crop,g_auto:face,w_300/r_max/co_rgb:68D2E7,e_outline:outer:15/" },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false }, //emailServices
    lastLogin: { type: Date, default: null },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verificationExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

userSchema.index({ verificationExpiresAt: 1 }, { expireAfterSeconds: 0 })
// userSchema.index({ refreshTokenExpiresAt: 1 }, { refreshTokenExpiresAt: 0 })
userSchema.pre('save', async function () {
  if (!this.isModified('password')) { return; }
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);