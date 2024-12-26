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

    const handleRSVP = async (eventId, index) => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to RSVP.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/events/${eventId}/rsvp`, { eventId }, { withCredentials: true });

            if (response.status === 200) {
                toast.success('RSVP successful!');
                const updatedEvents = [...events];
                updatedEvents[index].rsvpStatus = 'Confirmed'; // Update the RSVP status in the state
                setEvents(updatedEvents); // Re-render the events with updated RSVP status
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'Failed to RSVP. Please try again.');
            } else {
                toast.error('Failed to RSVP. Please try again.');
            }
        }
    };

    const handleResetFilters = () => {
        setFilters({
            date: '',
            location: '',
            eventType: ''
        });
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
                <span className="ml-2 text-gray-500">Only events from this date or later</span>

                <label className="ml-4 mr-2">Location</label>
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={handleResetFilters}
                    className="px-2 py-2 ml-5 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    Reset
                </button>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <p>No events available at the moment.</p>
                ) : (
                    events.map((event, index) => (
                        <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
                            {/* Event Image */}
                            {event.image && (
                                <img
                                    src={event.image} // Assuming event.image contains the image URL
                                    alt={event.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}

                            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <div className="mt-4">
                                <span className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</span>
                                <span className="ml-4 text-gray-600">Location: {event.location}</span>
                            </div>

                            {/* RSVP Button */}
                            <div className="mt-4 flex justify-between items-center">
                                {event.attendees.length < event.maxAttendees && event.rsvpStatus !== 'Confirmed' ? (
                                    <button
                                        onClick={() => handleRSVP(event._id, index)}
                                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
                                    >
                                        RSVP
                                    </button>
                                ) : (
                                    <button
                                        className="bg-gray-300 text-white py-2 px-4 rounded-md cursor-not-allowed"
                                        disabled
                                    >
                                        RSVP Confirmed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
