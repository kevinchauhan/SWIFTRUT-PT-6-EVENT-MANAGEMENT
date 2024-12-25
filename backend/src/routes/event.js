import express from 'express';
import { EventController } from '../controllers/EventController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();
const eventController = new EventController();

router.post('/', authenticate, (req, res) => eventController.createEvent(req, res));
router.get('/', (req, res) => eventController.getEvents(req, res));
router.post('/:eventId/rsvp', authenticate, (req, res) => eventController.rsvpEvent(req, res));
router.get('/:eventId/rsvp-status', authenticate, (req, res) => eventController.getRSVPStatus(req, res));
router.put('/:eventId', authenticate, (req, res) => eventController.editEvent(req, res));
router.delete('/:eventId', authenticate, (req, res) => eventController.deleteEvent(req, res));

export default router;
