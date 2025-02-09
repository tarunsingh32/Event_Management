/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";

export default function IndexPage() {
  
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data || []); 
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]); 
      });
  }, []);

  return (
    <>
      <div className="mt-1 flex flex-col">
        {events.length === 0 && (
          <div className="hidden sm:block">
            <div className="flex item-center inset-0">
              <img src="../src/assets/hero.png" alt="" className="w-full" />
            </div>
          </div>
        )}

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
          {events.length > 0 &&
            events.map((event) => {
              if (!event) return null; 

              const eventDate = new Date(event.eventDate || "");
              const currentDate = new Date();

              if (eventDate >= currentDate) {
                return (
                  <div
                    className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    key={event._id}
                  >
                    <div className="relative">
                      {event.image && (
                        <img
                          src={event.image} 
                          alt={event.title || "Event Image"}
                          width="300"
                          height="200"
                          className="w-full h-52 object-cover"
                        />
                      )}
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
                      
                      </div>

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
