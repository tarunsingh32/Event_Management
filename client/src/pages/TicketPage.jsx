import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TicketPage() {
    const { user } = useContext(UserContext);
    const [userTickets, setUserTickets] = useState([]);

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    const fetchTickets = async () => {
        axios.get(`/tickets/user/${user._id}`)
            .then(response => {
                setUserTickets(response.data);
            })
            .catch(error => {
                console.error('Error fetching user tickets:', error);
            });
    };

    const deleteTicket = async (ticketId) => {
        try {
            await axios.delete(`/tickets/${ticketId}`);
            fetchTickets();
            alert('Ticket Deleted');
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    return (
        <div className="flex flex-col flex-grow px-4 sm:px-6 md:px-12">
            <div className="mb-5 flex justify-between items-center">
                <Link to='/'>
                    <button className='inline-flex gap-2 p-3 bg-gray-100 text-blue-700 font-bold rounded-md'>
                        <IoMdArrowBack className='w-6 h-6' />
                        Back
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {userTickets.map(ticket => (
                    <div key={ticket._id} className="bg-gray-100 p-5 rounded-md relative shadow-md">
                        <button onClick={() => deleteTicket(ticket._id)} className="absolute top-2 right-2 cursor-pointer">
                            <RiDeleteBinLine className="h-6 w-6 text-red-700" />
                        </button>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <img src={ticket.ticketDetails.qr} alt="QRCode" className="w-24 h-24 md:w-32 md:h-32 object-cover" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                <div>
                                    Event Name: <br /><span className="font-extrabold text-primarydark">{ticket.ticketDetails.eventname.toUpperCase()}</span>
                                </div>
                                <div>
                                    Date & Time: <br /><span className="font-extrabold text-primarydark">{ticket.ticketDetails.eventdate.split("T")[0]}, {ticket.ticketDetails.eventtime}</span>
                                </div>
                                <div>
                                    Name: <br /><span className="font-extrabold text-primarydark">{ticket.ticketDetails.name.toUpperCase()}</span>
                                </div>
                                <div>
                                    Price: <br /><span className="font-extrabold text-primarydark">Rs. {ticket.ticketDetails.ticketprice}</span>
                                </div>
                                <div>
                                    Email: <br /><span className="font-extrabold text-primarydark">{ticket.ticketDetails.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
