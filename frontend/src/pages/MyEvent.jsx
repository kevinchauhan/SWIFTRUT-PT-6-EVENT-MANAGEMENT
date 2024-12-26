import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/events/my-events`,
                    { withCredentials: true }
                );
                setEvents(response.data.events);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch events. Please try again.');
                toast.error('Failed to fetch events.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        const confirm = window.confirm('Are you sure you want to delete this event?');
        if (!confirm) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/events/${eventId}`,
                { withCredentials: true }
            );
            setEvents(events.filter((event) => event._id !== eventId));
            toast.success('Event deleted successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to delete the event. Please try again.');
            toast.error('Failed to delete the event.');
        }
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-600">Loading your events...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    if (events.length === 0) {
        return (
            <div className="text-center mt-10 text-gray-600">
                <p>You haven't created any events yet.</p>
                <button
                    onClick={() => navigate('/create-event')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Create Your First Event
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Events</h1>
            {events.map((event) => (
                <div
                    key={event._id}
                    className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-sm text-gray-500">
                        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        <strong>Location:</strong> {event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                        <strong>Max Attendees:</strong> {event.maxAttendees}
                    </p>
                    {event.image && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="mt-4 w-full h-40 object-cover rounded-lg"
                        />
                    )}
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={() => navigate(`/edit-event/${event._id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(event._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyEvents;