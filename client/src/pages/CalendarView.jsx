import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns";
import { useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    axios.get("/events").then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => <div key={`empty-${index}`} className="p-2 bg-white ring-4 ring-background"></div>);

  return (
    <div className="p-4 sm:p-6 md:mx-16">
      <div className="rounded p-2">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 bg-gray-200 rounded-full" onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}>
            <BsCaretLeftFill className="w-5 h-5" />
          </button>
          <span className="text-lg sm:text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <button className="p-2 bg-gray-200 rounded-full" onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}>
            <BsFillCaretRightFill className="w-5 h-5"/>
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-sm sm:text-base">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 font-semibold bg-gray-200 ring-4 ring-background">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
          {
          emptyCells.concat(daysInMonth.map((date) => (
            <div key={date.toISOString()} className="p-2 min-h-[80px] sm:min-h-[100px] bg-white ring-4 ring-background flex flex-col items-start relative">
              <div className="font-bold">{format(date, "dd")}</div>
              <div className="absolute top-8 left-1 right-1 text-xs sm:text-sm">
                {events
                  .filter((event) => format(new Date(event.eventDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                  .map((event) => (
                    <div key={event._id} className="mt-1 sm:mt-2">
                      <Link to={`/event/${event._id}`}>
                        <div className="text-white bg-primary rounded p-1 font-bold text-xs sm:text-sm">{event.title.toUpperCase()}</div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
