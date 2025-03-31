import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true, 
        enum: ['English', 'Slovak', 'Czech', 'Spanish'], 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    }
});

const translationPoiSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true, 
        enum: ['English', 'Slovak', 'Czech', 'Spanish'], 
    },
    title: {
        type: String,
        required: true,
    },
    content: { 
        type: String,
        required: false,
    },
});

const translationQuizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['single', 'multiple', 'short-answer', 'slider', 'pairs', 'order', 'foto', 'true-false']
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
            required: false,
        },
        incorrect: {
            type: String,
            required: false,
        }
    },
    feedbackContent: {
        type: String,
        required: false
    }
});

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
        enum: ['single', 'multiple', 'short-answer', 'slider', 'pairs', 'order', 'foto', 'true-false']
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
            required: false,
        },
        incorrect: {
            type: String,
            required: false,
        }
    },
    feedbackContent: {
        type: String,
        required: false,
    },
    translation: [translationQuizSchema],
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
    audioPath: { // if records audio, here will be the link
        type: String, // path to the audio
        required: false,
    },
    quiz: { // this will be Interaktivny
        type: quizSchema,
        required: false,
    },
    translation: [translationPoiSchema],
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
        estimatedTime: {
            type: Number,
            default: 0,
        },
        language: { // Original trail language
            type: String,
            required: true,  
            default: 'English',          
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
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        translation: [translationSchema],
    }
);

export const Trail = mongoose.model('Trail', trailSchema);