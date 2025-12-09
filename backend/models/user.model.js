import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  adress: {
    type: String,
    required: false,
  },
  DOB: {
    type: Date,
    required: false,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
  currencyPreference: {
    type: String,
    required: false,
    default: "BDT",
  },
  LanguagePreference: {
    type: String,
    required: false,
    default: "Bangla",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;
