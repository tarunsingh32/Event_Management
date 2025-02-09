import { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../UserContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {setUser} = useContext(UserContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail && storedPass) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);

  async function loginUser(ev){
      ev.preventDefault();
      if (!email.trim() || !password.trim()) {
        alert('Please enter both email and password');
        return;
      }

      try{
        const {data} = await axios.post('/login', {email, password});
        setUser(data);
        alert('Login success');

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedpass', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedpass');
        }

        setRedirect(true);
      }catch(e){
        alert('Login failed');
      }
  }

  if(redirect){
    return <Navigate to={'/'}/>;
  }
  
  return (
    <div className="flex flex-col lg:flex-row w-full h-full px-5 py-10 justify-center items-center mt-10 lg:ml-24 lg:mt-20">
      <div className="bg-white w-full sm:w-4/5 md:w-3/4 lg:w-1/3 px-7 py-7 rounded-xl shadow-lg">
        <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
            <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl text-center'>Sign In</h1>

            <div className="input w-full">
              <input type="email" placeholder="Email" className="input-et w-full" value={email} onChange={ev => setEmail(ev.target.value)} />
            </div>

            <div className="input w-full relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="input-et w-full" value={password} onChange={ev => setPassword(ev.target.value)} />
              <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className='flex w-full justify-between mt-4 text-sm'>
              <label className='flex gap-2'>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)}/> Remember Me
              </label>
              <Link to={'/forgotpassword'} className='text-blue-500'>Forgot Password?</Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full mt-5">
            <button type="submit" className="text-white bg-primary rounded w-full py-2 font-bold">Sign in</button>
              <Link to={'/register'} className="w-full">
                <button className="text-black border rounded w-full py-2 font-bold">Sign Up</button>
              </Link>
            </div>
        </form>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center right-box mt-10 lg:mt-0">
        <div className='text-3xl font-black text-center'>Welcome to</div>
        <img src="../src/assets/logo.png" alt="" className="w-48 mt-3"/>
        <img src="../src/assets/signinpic.svg" alt="" className='w-80 mt-10'/>
      </div>
    </div>
  )
}
