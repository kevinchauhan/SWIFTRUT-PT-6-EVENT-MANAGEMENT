import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { isAuthenticated } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        date: '',
        location: '',
        eventType: ''
    });

    useEffect(() => {
        // Fetch events from backend
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/events`, {
                    params: filters
                });
                setEvents(response.data?.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleRSVP = async (eventId) => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to RSVP.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/events/${eventId}/rsvp`, { eventId }, { withCredentials: true });

            if (response.status === 200) {
                toast.success('RSVP successful!');
                // Optionally, update the event list with RSVP status
            }
        } catch (error) {
            toast.error('Failed to RSVP. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upcoming Events</h2>

            {/* Filters */}
            <div className="mb-6">
                <label className="mr-2">Date</label>
                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                />
                <label className="ml-4 mr-2">Location</label>
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <p>No events available at the moment.</p>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <div className="mt-4">
                                <span className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</span>
                                <span className="ml-4 text-gray-600">Location: {event.location}</span>
                            </div>

                            {/* RSVP Button */}
                            <div className="mt-4 flex justify-between items-center">
                                {event.attendees.length < event.maxAttendees ? (
                                    <button
                                        onClick={() => handleRSVP(event._id)}
                                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
                                    >
                                        RSVP
                                    </button>
                                ) : (
                                    <span className="text-red-500">Event full</span>
                                )}
                                <Link to={`/event/${event._id}`} className="text-indigo-600 hover:underline">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
