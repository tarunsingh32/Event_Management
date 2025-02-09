import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState('');
  
  async function registerUser(ev){
    ev.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try{
      await axios.post('/register', {
        name,
        email,
        password,
      });
      alert('Registration Successful')
      setRedirect(true)
    }catch(e){
      alert('Registration failed')
    }
  }

  if (redirect){
    return <Navigate to={'/login'} />
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full px-5 py-10 justify-center items-center mt-10">
      <div className="hidden lg:flex flex-col items-center justify-center right-box">
        <div className="text-3xl font-black text-center">Welcome to</div>
        <img src="../src/assets/logo.png" alt="" className="w-48 mt-3"/>
        <img src="../src/assets/signuppic.svg" alt="" className='w-80 mt-10'/>
      </div>

      <div className="bg-white w-full sm:w-4/5 md:w-3/4 lg:w-1/3 px-7 py-7 rounded-xl shadow-lg">
        <form className="flex flex-col w-auto items-center" onSubmit={registerUser}>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl text-center'>Sign Up</h1>
          
          <div className="input w-full border border-gray-300 rounded-md p-2">
            <input type="text" placeholder="Name" className="input-et w-full outline-none" value={name} onChange={ev => setName(ev.target.value)} />
          </div>
          
          <div className="input w-full border border-gray-300 rounded-md p-2 mt-3">
            <input type="email" placeholder="Email" className="input-et w-full outline-none" value={email} onChange={ev => setEmail(ev.target.value)} />
          </div>
          
          <div className="input w-full border border-gray-300 rounded-md p-2 mt-3">
            <input type="password" placeholder="Password" className="input-et w-full outline-none" value={password} onChange={ev => setPassword(ev.target.value)} />
          </div>
          
          <div className="input w-full border border-gray-300 rounded-md p-2 mt-3">
            <input type="password" placeholder="Confirm Password" className="input-et w-full outline-none" value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />
          </div>
          
          
          <div className="flex flex-col sm:flex-row gap-2 w-full mt-5">
            <Link to={'/login'} className="w-full">
              <button className="text-black border rounded w-full py-2 font-bold">Sign In</button>
            </Link>
              <button type="submit"  className="text-white bg-primary rounded w-full py-2 font-bold">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  )
}
