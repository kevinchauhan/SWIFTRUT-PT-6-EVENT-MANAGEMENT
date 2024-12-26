import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        maxAttendees: '',
        image: '',
    });
    const [error, setError] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required.';
        if (!formData.description) newErrors.description = 'Description is required.';
        if (!formData.date) newErrors.date = 'Date is required.';
        if (!formData.location) newErrors.location = 'Location is required.';
        if (!formData.maxAttendees) newErrors.maxAttendees = 'Max attendees is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }
        setError({});

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                maxAttendees: formData.maxAttendees,
                image: formData.image,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/events`,
                payload,
                { withCredentials: true }
            );

            if (response.status === 201) {
                setSuccess('Event created successfully!');
                setTimeout(() => {
                    navigate('/my-events'); // Redirect to My Events page
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            setError({ global: 'Failed to create event. Please try again.' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Event</h1>
            {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error.title && <p className="text-red-500 text-sm">{error.title}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error.description && <p className="text-red-500 text-sm">{error.description}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error.location && <p className="text-red-500 text-sm">{error.location}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
                    <input
                        type="number"
                        name="maxAttendees"
                        min={1}
                        value={formData.maxAttendees}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error.maxAttendees && <p className="text-red-500 text-sm">{error.maxAttendees}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
