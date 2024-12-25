import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    maxAttendees: {
        type: Number,
        required: true,
    },
    attendees: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            rsvpStatus: {
                type: String,
                enum: ['Confirmed', 'Pending', 'Declined'],
                default: 'Pending',
            },
        },
    ],
    image: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notifications: [
        {
            message: {
                type: String,
            },
            sentAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });

export const Event = mongoose.model('Event', eventSchema);
