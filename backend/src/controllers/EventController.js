import { Event } from '../models/Event.js';

export class EventController {
    async createEvent(req, res) {
        try {
            const { title, description, date, location, maxAttendees, image } = req.body;

            if (!title || !description || !date || !location || !maxAttendees) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const newEvent = new Event({
                title,
                description,
                date,
                location,
                maxAttendees,
                image,
                userId: req.user.id,
            });

            await newEvent.save();
            res.status(201).json({ success: true, event: newEvent });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getEvents(req, res) {
        try {
            const { date, location, eventType, limit = 10, page = 1, sortBy = 'date', order = 'asc' } = req.query;
            const filter = {};

            if (date) filter.date = { $gte: new Date(date) };
            if (location) filter.location = location;
            if (eventType) filter.eventType = eventType;

            const events = await Event.find(filter)
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await Event.countDocuments(filter);

            res.status(200).json({
                success: true,
                events,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async rsvpEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }

            if (event.attendees.length >= event.maxAttendees) {
                return res.status(400).json({ success: false, message: "Event is fully booked" });
            }

            const alreadyRSVPed = event.attendees.some(
                attendee => attendee.userId.toString() === req.user.id
            );

            if (alreadyRSVPed) {
                return res.status(400).json({ success: false, message: "You have already RSVP'd" });
            }

            event.attendees.push({ userId: req.user.id, rsvpStatus: "Confirmed" });
            await event.save();
            res.status(200).json({ success: true, message: "RSVP successful" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getRSVPStatus(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }

            const attendee = event.attendees.find(
                attendee => attendee.userId.toString() === req.user.id
            );

            if (!attendee) {
                return res.status(404).json({ success: false, message: "No RSVP found for this event" });
            }

            res.status(200).json({ success: true, rsvpStatus: attendee.rsvpStatus });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getMyEvents(req, res) {
        try {
            const userId = req.user.id;
            const events = await Event.find({ userId });

            res.status(200).json({ success: true, events });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getEventRSVPs(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }

            if (event.userId.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            res.status(200).json({ success: true, attendees: event.attendees });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async editEvent(req, res) {
        try {
            const { eventId } = req.params;
            const { title, description, date, location, maxAttendees, image } = req.body;

            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }

            if (event.userId.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            event.title = title || event.title;
            event.description = description || event.description;
            event.date = date || event.date;
            event.location = location || event.location;
            event.maxAttendees = maxAttendees || event.maxAttendees;
            event.image = image || event.image;

            await event.save();
            res.status(200).json({ success: true, event });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async deleteEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }

            if (event.userId.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            await event.remove();
            res.status(200).json({ success: true, message: "Event deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
