const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
    },
    course: {
        type: String,
        required: [true, 'Course selection is required'],
        enum: [
            'Regular Tuitions (6-10)',
            'Vedic Maths',
            'Olympiads',
            'Foundation Course',
            'Coding Classes',
            'Home Tutors'
        ]
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'enrolled', 'not-interested'],
        default: 'new'
    },
    source: {
        type: String,
        enum: ['website', 'whatsapp', 'phone', 'walk-in'],
        default: 'website'
    },
    notes: {
        type: String,
        trim: true
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

// Update timestamp on save
inquirySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Inquiry', inquirySchema);
