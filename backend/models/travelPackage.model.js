import mongoose from 'mongoose';

const travelPackageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'No description provided',
    },
    destination: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
        enum: ['Adventure', 'Family', 'Cultural', 'Honeymoon', 'Friendship'],
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    availableDates: [{
        type: Date,
    }],
    ratings: {
        type: Number,
        min: 1,
        max: 5,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, { timestamps: true });

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);

export default TravelPackage;
