import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    optional: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: null,
    likes: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post("/createEvent", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Event Created");
      setRedirect(true);
    } catch (error) {
      console.error("Error posting event:", error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📅 Post an Event</h1>

        <form onSubmit={handleSubmit} className="space-y-5" >
          <div>
            <label className="form-label">Event Title</label>
            <input type="text" name="title" className="input-box" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-label">Optional</label>
            <input type="text" name="optional" className="input-box" value={formData.optional} onChange={handleChange} required/>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" className="input-box h-24" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div>
            <label className="form-label">Organized By</label>
            <input type="text" name="organizedBy" className="input-box" value={formData.organizedBy} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Event Date</label>
              <input type="date" name="eventDate" className="input-box" value={formData.eventDate} onChange={handleChange} required/>
            </div>
            <div>
              <label className="form-label">Event Time</label>
              <input type="time" name="eventTime" className="input-box" value={formData.eventTime} onChange={handleChange} required/>
            </div>
          </div>

          <div>
            <label className="form-label">Location</label>
            <input type="text" name="location" className="input-box" value={formData.location} onChange={handleChange} required/>
          </div>

          <div>
            <label className="form-label">Ticket Price</label>
            <input type="number" name="ticketPrice" className="input-box" value={formData.ticketPrice} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-label">Event Image</label>
            <input type="file" name="image" className="input-box bg-white" onChange={handleImageUpload} required/>
          </div>
          {/* <Link to={'/'}> */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all">
            🚀 Submit Event
          </button>
          {/* </Link> */}
          
        </form>
      </div>
    </div>
  );
}
