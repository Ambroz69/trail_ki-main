import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    questionImage: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
        enum: ['single', 'multiple', 'short-answer', 'slider', 'pairs', 'order', 'foto']
    },
    points: {
        type: Number,
        required: false, // change to true after implementation
    },
    answers: [{
        text: { type: String, required: false},
        pairText: { type: String, required: false},
        minValue: { type: Number, required: false},
        maxValue: { type: Number, required: false},
        isCorrect: { type: Boolean, required: false},
    }],
    feedback: {
        correct: {
            type: String,
            required: true,
        },
        incorrect: {
            type: String,
            required: true,
        }
    }
});

const poiSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    content: { // this will be Poznatok 
        type: String,
        required: false,
    },
    quiz: { // this will be Interaktivny
        type: quizSchema,
        required: false,
    }
});

const trailSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String, // path to picture
            required: false, // for now
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
        },
        locality: {
            type: String,
            required: true,
            enum: ['Slovakia', 'Czech Republic', 'Spain', 'Other'],
        },
        season: {
            type: String,
            required: true,
            enum: ['All Seasons', 'Spring', 'Summer', 'Autumn', 'Winter'],
        },
        length: { // lets try to count the length of the trail
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5, // 5 star rating for now
            default: 0,
        },
        published: {
            type: Boolean,
            default: false,
        },
        points: [poiSchema],
    }
);

export const Trail = mongoose.model('Trail', trailSchema);