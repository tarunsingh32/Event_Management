import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  useEffect(() => {
    axios.get("/events").then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);

  async function logout() {
    await axios.post('/logout');
    setUser(null);
  }

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <header className='flex py-2 px-6 sm:px-6 justify-between items-center relative'>
        <Link to={'/'} className="flex items-center">
          <img src="../src/assets/logo.png" alt="Logo" className='w-35 h-12'/>
        </Link>

        <div className='flex bg-white rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-gray-200'>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <div ref={searchInputRef} className='w-full'>
            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} className='text-sm text-black outline-none w-full' />
          </div>
        </div>

        {searchQuery && (
          <div className="absolute z-10 mt-12 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded shadow-lg p-2">
            {events.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((event) => (
                <div key={event._id} className="p-2 border-b last:border-none">
                  <Link to={`/event/${event._id}`} className="block text-black text-lg w-full">
                    {event.title}
                  </Link>
                </div>
              ))}
          </div>
        )}

        <div className='lg:hidden'>
          <BsFillCaretDownFill className="h-5 w-5 cursor-pointer" onClick={() => setisMenuOpen(!isMenuOpen)} />
        </div>

        <nav className={`absolute top-full right-0 bg-white shadow-md w-48 rounded-lg z-20 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-96'} lg:hidden`}>
          {!!user ? (
            <div className="flex flex-col font-semibold text-[16px] p-2">
              <Link to={'/createEvent'} className="block p-2 hover:bg-gray-100 rounded">Create Event</Link>
              <Link to={'/wallet'} className="block p-2 hover:bg-gray-100 rounded">Wallet</Link>
              <Link to={'/verification'} className="block p-2 hover:bg-gray-100 rounded">Center</Link>
              <Link to={'/calendar'} className="block p-2 hover:bg-gray-100 rounded">Calendar</Link>
              <button onClick={logout} className="block p-2 hover:bg-gray-100 rounded text-left w-full">Log out</button>
            </div>
          ) : (
            <Link to={'/login'} className="block p-2 text-center hover:bg-gray-100 rounded">Sign in</Link>
          )}
        </nav>

        <div className='hidden lg:flex gap-5 text-sm'>
          <Link to={'/createEvent'} className='hover:text-primarydark'>Create Event</Link>
          <Link to={'/wallet'} className='hover:text-primarydark'>Wallet</Link>
          <Link to={'/verification'} className='hover:text-primarydark'>Center</Link>
          <Link to={'/calendar'} className='hover:text-primarydark'>Calendar</Link>
        </div>

        {!!user && (
          <div className="hidden lg:flex items-center gap-2">
            <Link to={'/useraccount'} className="font-bold">{user.name.toUpperCase()}</Link>
            <Link to={'/login'}>
            <button onClick={logout} className="flex items-center gap-1 text-red-500 hover:text-red-700">
              <RxExit className="w-5 h-5" /> Log out
            </button>
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
