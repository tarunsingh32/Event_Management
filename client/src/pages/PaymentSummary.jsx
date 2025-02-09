import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { UserContext } from '../UserContext';
import Qrcode from 'qrcode';

export default function PaymentSummary() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [event, setEvent] = useState(null);
    const [redirect, setRedirect] = useState('');

    const [details, setDetails] = useState({
        name: '',
        email: '',
        contactNo: '',
    });

    const [payment, setPayment] = useState({
        nameOnCard: 'John Doe',
        cardNumber: '1234 5678 9012 3456',
        expiryDate: '12/26',
        cvv: '123',
    });

    const defaultTicketState = {
      userid: user ? user._id : '',
      eventid: '',
      ticketDetails: {
        name: user ? user.name : '',
        email: user ? user.email : '',
        eventname: '',
        eventdate: '',
        eventtime: '',
        ticketprice: '',
        qr: '',
      }
    };
    const [ticketDetails, setTicketDetails] = useState(defaultTicketState);
  
    useEffect(()=>{
      if(!id){
        return;
      }
      axios.get(`/event/${id}/ordersummary/paymentsummary`).then(response => {
        setEvent(response.data)

        setTicketDetails(prevTicketDetails => ({
          ...prevTicketDetails,
          eventid: response.data._id,
          ticketDetails: {
            ...prevTicketDetails.ticketDetails,
            eventname: response.data.title,
            eventdate: response.data.eventDate.split("T")[0],
            eventtime: response.data.eventTime,
            ticketprice: response.data.ticketPrice,
          }
        }));
      }).catch((error) => {
        console.error("Error fetching events:", error);
      });
    }, [id]);
    useEffect(() => {
      setTicketDetails(prevTicketDetails => ({
        ...prevTicketDetails,
        userid: user ? user._id : '',
        ticketDetails: {
          ...prevTicketDetails.ticketDetails,
          name: user ? user.name : '',
          email: user ? user.email : '',
        }
      }));
    }, [user]);

    if (!event) return '';

    const handleChangeDetails = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const createTicket = async (e) => {
      e.preventDefault();
      if (!details.name || !details.email || !details.contactNo) {
        alert("Please fill in all required fields.");
        return;
    }
      try {
        const qrCode = await generateQRCode(
          ticketDetails.ticketDetails.eventname,
          ticketDetails.ticketDetails.name
        );
        const updatedTicketDetails = {
          ...ticketDetails,
          ticketDetails: {
            ...ticketDetails.ticketDetails,
            qr: qrCode,
          }
        };
        const response = await axios.post(`/tickets`, updatedTicketDetails);
        alert("Ticket Created");
        setRedirect(true)
        console.log('Success creating ticket', updatedTicketDetails)
      } catch (error) {
        console.error('Error creating ticket:', error);
      }
    
    }

    async function generateQRCode(name, eventName) {
      try {
        const qrCodeData = await Qrcode.toDataURL(
            `Event Name: ${name} \n Name: ${eventName}`
        );
        return qrCodeData;
      } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
      }
    }
 
    if (redirect) {
        return <Navigate to={'/wallet'} />;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Link to={`/event/${event._id}/ordersummary`} className="flex items-center gap-2 text-blue-600 font-bold">
                <IoMdArrowBack className="w-6 h-6" />
                Back
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Payment Form */}
                <div className="md:col-span-2 bg-gray-100 shadow-lg p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Your Details</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={details.name}
                            onChange={handleChangeDetails}
                            placeholder="Name *"
                            className="w-full p-3 border rounded-md"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={details.email}
                            onChange={handleChangeDetails}
                            placeholder="Email *"
                            className="w-full p-3 border rounded-md"
                            required
                        />
                        <input
                            type="tel"
                            name="contactNo"
                            value={details.contactNo}
                            onChange={handleChangeDetails}
                            placeholder="Contact No *"
                            className="w-full p-3 border rounded-md"
                            required
                        />
                    </div>

                    {/* Payment Section */}
                    <h2 className="text-xl font-bold mt-8">Payment Option</h2>
                    <div className="mt-4">
                        <button className="w-full py-3 text-black bg-blue-100 border rounded-md" disabled>
                            Credit / Debit Card
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <input
                            type="text"
                            name="nameOnCard"
                            value={payment.nameOnCard}
                            className="p-3 border rounded-md"
                            disabled
                        />
                        <input
                            type="text"
                            name="cardNumber"
                            value={payment.cardNumber}
                            className="p-3 border rounded-md"
                            disabled
                        />
                        <input
                            type="text"
                            name="expiryDate"
                            value={payment.expiryDate}
                            className="p-3 border rounded-md"
                            disabled
                        />
                        <input
                            type="text"
                            name="cvv"
                            value={payment.cvv}
                            className="p-3 border rounded-md"
                            disabled
                        />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-blue-100 p-6 rounded-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Order Summary</h2>
                        <p className="mt-4 font-semibold">{event.title}</p>
                        <p className="text-sm">{event.eventDate.split("T")[0]}, {event.eventTime}</p>
                        <hr className="my-4" />
                        <p className="flex justify-between text-lg font-bold">
                            <span>Subtotal:</span>
                            <span>LKR. {event.ticketPrice}</span>
                        </p>
                    </div>

                    {/* New Button Placement */}
                    <button
                        onClick={createTicket}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md"
                    >
                        Make Payment
                    </button>
                </div>
            </div>
        </div>
    );
}