import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';

export default function OrderSummary() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    useEffect(() => {
        if (!id) return;
        axios.get(`/event/${id}/ordersummary`).then(response => {
            setEvent(response.data);
        }).catch((error) => {
            console.error("Error fetching events:", error);
        });
    }, [id]);

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };

    if (!event) return '';
    return (
        <div className="px-4 md:px-12">
            <Link to={'/event/' + event._id}>
                <button className="inline-flex mt-8 gap-2 p-3 bg-gray-100 text-blue-700 font-bold rounded-md items-center">
                    <IoMdArrowBack className="w-6 h-6" /> Back
                </button>
            </Link>
            
            <div className="flex flex-col md:flex-row mt-6 gap-6">
                <div className="p-4 bg-gray-100 w-full md:w-3/4">
                    <h2 className="text-left font-bold">Terms & Conditions</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        <li>Refunds will be provided for ticket cancellations made up to 14 days before the event date...</li>
                        <li>Tickets will be delivered to your registered email address as e-tickets...</li>
                        <li>Each individual is allowed to purchase a maximum of 2 tickets for this event...</li>
                        <li>In case of cancellation or postponement, attendees will be notified...</li>
                        <li>Tickets for postponed events will not be refunded...</li>
                        <li>Your privacy is important to us...</li>
                        <li>Please review and accept our terms before proceeding...</li>
                    </ul>
                </div>

                <div className="bg-blue-100 p-4 w-full md:w-1/4">
                    <h2 className="font-bold">Booking Summary</h2>
                    <div className="text-sm flex justify-between mt-5">
                        <span>{event.title}</span>
                        <span className="pr-5">LKR. {event.ticketPrice}</span>
                    </div>
                    <hr className="my-2 border-gray-300" />
                    <div className="text-sm font-bold flex justify-between mt-5">
                        <span>SUB TOTAL</span>
                        <span className="pr-5">LKR. {event.ticketPrice}</span>
                    </div>
                    
                    <div className="flex mt-4 text-sm items-center">
                        <input type="checkbox" className="h-5 mr-2" onChange={handleCheckboxChange} />
                        <span>I have verified the event details before proceeding.</span>
                    </div>

                    <div className="mt-5">
                        <Link to={'/event/' + event._id + '/ordersummary/paymentsummary'}>
                            <button 
                                className={`p-3 w-full text-gray-100 rounded-md ${isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'}`} 
                                disabled={!isCheckboxChecked}
                            >
                                Proceed
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
