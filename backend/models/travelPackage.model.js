import monogoose from 'mongoose';
const { Schema, model } = monogoose;

const travelPackageSchema = new Schema( {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    destination:{
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true, // duration in days
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
        enum: ['Adventure', 'family', 'Cultural', 'honeymoon', 'frindship'],
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    avaiableDates: [{
        type: Date,
    }],
    ratings: {
        type: Number,
        min: 1,
        max: 5,
    },
    reviews: [reviewIdSchema],


}, { timestamps: true } );

reviewIdSchema = new Schema({
    reviewId: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'Review',
    }
});

const TravelPackage = model( 'TravelPackage', travelPackageSchema );

export default TravelPackage;
