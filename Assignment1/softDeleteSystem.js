const mongoose = require('mongoose');

function softDeletePlugin(schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  });

  function hideDeleted(next) {
    this.where({ isDeleted: false });
    next();
  }

  schema.pre('find', hideDeleted);
  schema.pre('findOne', hideDeleted);
  schema.pre('countDocuments', hideDeleted);
  schema.pre('findOneAndUpdate', hideDeleted);
  schema.pre('updateMany', hideDeleted);
  schema.pre('updateOne', hideDeleted);

  schema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
    return this;
  };

  schema.statics.softDeleteById = function (id) {
    return this.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date()
        }
      },
      { new: true }
    );
  };

  schema.statics.restoreById = function (id) {
    return this.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: false,
          deletedAt: null
        }
      },
      { new: true }
    );
  };

  schema.pre('findOneAndDelete', async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) {
      doc.isDeleted = true;
      doc.deletedAt = new Date();
      await doc.save();
    }

    next(new Error('Document deleted softly'));
  });
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

productSchema.plugin(softDeletePlugin);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = {
  Product,
  softDeletePlugin
};
