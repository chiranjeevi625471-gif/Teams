const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    }
});

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true
    },
    icon: {
        type: String,
        default: 'fas fa-book'
    },
    iconColor: {
        type: String,
        default: 'orange'
    },
    eligibility: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    fee: {
        type: Number
    },
    steps: [stepSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Course', courseSchema);
