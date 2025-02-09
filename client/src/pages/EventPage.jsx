import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState(0);
  const userId = 'current_user_id'; // Replace with the actual user ID

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/event/${id}`)
      .then((response) => {
        setEvent(response.data);
        setAttendees(response.data.Participants);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });

    // Setting up WebSocket connection
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.eventId === id) {
        setAttendees(data.attendees);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [id]);

  const handleTicketBooking = () => {
    axios.post('/tickets', {
      eventId: id,
      userId: userId,
      name: 'User Name', 
      // other ticket details
    })
    .then(response => {
      console.log('Ticket created successfully:', response.data);
      // setAttendees(attendees+1);
      // No need to update attendees here as it will be handled by WebSocket
    })
    .catch(error => {
      console.error('Error creating ticket:', error);
    });
  };

  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(facebookShareUrl);
  };

  if (!event) return "";
  return (
    <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow space-y-6">
      <div className="rounded-lg overflow-hidden shadow-md">
        {event?.image && (
          <img
            src={event.image}
            alt="Event Image"
            className="w-full h-[500px] object-cover"
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          {event.title.toUpperCase()}
        </h1>
        <Link to={`/event/${event._id}/ordersummary`}>
        <button onClick={handleTicketBooking} className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primarydark transition-all">
          Book Ticket
        </button>
       </Link>

      </div>
       
      <h2 className="text-xl font-bold text-primarydark">
        {event.ticketPrice === 0 ? "Free" : `LKR. ${event.ticketPrice}`}
      </h2>

      <p className="text-lg text-gray-600 leading-relaxed">
        {event.description}
      </p>

      <h3 className="text-xl font-bold text-primarydark">
        Organized By {event.organizedBy}
      </h3>

      <div className="p-5 bg-gray-100 rounded-lg shadow-sm flex flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <AiFillCalendar className="text-primarydark text-2xl" />
          <div>
            <h4 className="text-lg font-bold">Date and Time</h4>
            <p className="text-gray-600">
              Date: {event.eventDate.split("T")[0]}
            </p>
            <p className="text-gray-600">Time: {event.eventTime}</p>
            <p className="text-gray-600">Attendees: {attendees}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdLocationPin className="text-primarydark text-2xl" />
          <div>
            <h4 className="text-lg font-bold">Location</h4>
            <p className="text-gray-600">{event.location}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold">Share with friends</h3>
        <div className="flex gap-5 mt-4 text-gray-600">
          <button
            onClick={handleCopyLink}
            className="hover:text-primarydark transition"
          >
            <FaCopy className="text-2xl" />
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="hover:text-green-500 transition"
          >
            <FaWhatsappSquare className="text-2xl" />
          </button>
          <button
            onClick={handleFacebookShare}
            className="hover:text-blue-600 transition"
          >
            <FaFacebook className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
