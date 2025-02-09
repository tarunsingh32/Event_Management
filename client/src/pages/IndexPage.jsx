/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

export default function IndexPage() {
  
  const [events, setEvents] = useState([]);

  //! Fetch events from the server ---------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data || []); // Ensure response is always an array
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]); // Prevent crashing by setting an empty array
      });
  }, []);

  //! Like Functionality --------------------------------------------------------------
  // const handleLike = (eventId) => {
  //   axios
  //     .post(`/event/${eventId}`)
  //     .then((response) => {
  //       setEvents((prevEvents) =>
  //         prevEvents.map((event) =>
  //           event._id === eventId
  //             ? { ...event, likes: (event.likes || 0) + 1 }
  //             : event
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error liking event:", error);
  //     });
  // };

  return (
    <>
      <div className="mt-1 flex flex-col">
        {/* Hide Hero Section if Events Exist */}
        {events.length === 0 && (
          <div className="hidden sm:block">
            <div className="flex item-center inset-0">
              <img src="../src/assets/hero.jpg" alt="" className="w-full" />
            </div>
          </div>
        )}

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
          {/* Checking whether there are events or not */}
          {events.length > 0 &&
            events.map((event) => {
              if (!event) return null; // Ensure event is defined

              const eventDate = new Date(event.eventDate || "");
              const currentDate = new Date();

              //! Check if the event date is in the future
              if (eventDate >= currentDate) {
                return (
                  <div
                    className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    key={event._id}
                  >
                    <div className="relative">
                      {event.image && (
                        <img
                          src={event.image} // Cloudinary image URL
                          alt={event.title || "Event Image"}
                          width="300"
                          height="200"
                          className="w-full h-52 object-cover"
                        />
                      )}
                      {/* <div className="absolute flex gap-4 bottom-4 right-4">
                        <button onClick={() => handleLike(event._id)}>
                          <BiLike className="w-auto h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                        </button>
                      </div> */}
                    </div>

                    <div className="p-4 space-y-3">
                      <h1 className="text-lg font-bold text-gray-900 truncate">
                        {event.title ? event.title.toUpperCase() : "Untitled"}
                      </h1>

                      <div className="flex justify-between text-sm text-gray-600 font-medium">
                        <span>
                          {event.eventDate
                            ? event.eventDate.split("T")[0]
                            : "Unknown Date"}
                          , {event.eventTime || "Unknown Time"}
                        </span>
                        <span className="text-primary">
                          {event.ticketPrice === 0
                            ? "Free"
                            : `Rs. ${event.ticketPrice || "N/A"}`}
                        </span>
                      </div>

                      <p className="text-gray-500 text-xs truncate">
                        {event.description || "No description available"}
                      </p>

                      <div className="flex justify-between text-xs text-gray-700">
                        <span>
                          Organized By:{" "}
                          <strong>{event.organizedBy || "Unknown"}</strong>
                        </span>
                        {/* <span>
                          Created By:{" "}
                          <strong>
                            {event.owner ? event.owner.toUpperCase() : "Unknown"}
                          </strong>
                        </span> */}
                      </div>

                      {/* ✅ Show Attendees Count
                      <div className="text-sm font-medium text-blue-600">
                        Attendees: {event.attendees || 0}
                      </div> */}

                      <Link to={`/event/${event._id}`} className="block">
                        <button className="mt-2 flex items-center justify-center w-full gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                          View Details <BsArrowRightShort className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </>
  );
}
