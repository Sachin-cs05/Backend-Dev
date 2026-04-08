const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    loginAt: {
      type: Date,
      default: null
    },
    logoutAt: {
      type: Date,
      default: null
    },
    lastActiveAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function (next) {
  if (this.isNew && !this.lastActiveAt) {
    this.lastActiveAt = new Date();
  }

  if (this.isModified('loginAt') || this.isModified('logoutAt')) {
    this.lastActiveAt = new Date();
  }

  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};

  if (!update.$set) {
    update.$set = {};
  }

  update.$set.lastActiveAt = new Date();
  this.setUpdate(update);
  next();
});

userSchema.pre('updateOne', function (next) {
  const update = this.getUpdate() || {};

  if (!update.$set) {
    update.$set = {};
  }

  update.$set.lastActiveAt = new Date();
  this.setUpdate(update);
  next();
});

userSchema.methods.recordLogin = async function () {
  const currentTime = new Date();
  this.loginAt = currentTime;
  this.lastActiveAt = currentTime;
  await this.save();
  return this;
};

userSchema.methods.recordLogout = async function () {
  const currentTime = new Date();
  this.logoutAt = currentTime;
  this.lastActiveAt = currentTime;
  await this.save();
  return this;
};

userSchema.methods.touchActivity = async function () {
  this.lastActiveAt = new Date();
  await this.save();
  return this;
};

userSchema.statics.recordLoginById = function (userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: {
        loginAt: new Date(),
        lastActiveAt: new Date()
      }
    },
    { new: true }
  );
};

userSchema.statics.recordLogoutById = function (userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: {
        logoutAt: new Date(),
        lastActiveAt: new Date()
      }
    },
    { new: true }
  );
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDatabase(connectionString) {
  await mongoose.connect(connectionString);
  return mongoose.connection;
}

module.exports = {
  User,
  userSchema,
  connectDatabase
};
