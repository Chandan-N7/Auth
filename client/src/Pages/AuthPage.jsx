import React, { useState } from 'react'
import Input from '../components/Input'
import { Loader, Mail, User } from 'lucide-react'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore'
import { Link, useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [seePass, setSeePass] = useState(false)
  const [loginBox, setLoginBox] = useState(false)
  const pass = true;
  const { signup, error, isLoading, login } = useAuthStore();
  const navigate = useNavigate();


  const handleLoginBox = () => {
    setLoginBox(true),
      setName('')
    setEmail('')
    setPassword('')
  }
  const handleSignupBox = () => {
    setLoginBox(false),
      setName('')
    setEmail('')
    setPassword('')
  }

  const handlelogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignup = async () => {
    try {
      await signup(email, password, name);
      navigate("/verify-email", { state: { email } });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div
      className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          {loginBox ? "Welcome Back" : "Create Account"}
        </h2>
        <div>
          {!loginBox && <Input
            icon={User}
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />}

          <Input
            icon={Mail}
            type='text'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Mail}
            type={seePass ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            seePass={seePass}
            setSeePass={setSeePass}
            pass={pass}
          />

          {loginBox && <div className='flex items-center mb-6'>
            <Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
              Forgot password?
            </Link>
          </div>}

          {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}
          {!loginBox && <PasswordStrengthMeter password={password} />}

          {loginBox ?
            <button
              disabled={isLoading}
              onClick={handlelogin}
              className='bg-gradient-to-r from-green-400 to-emerald-500 w-full mt-5 py-3 px-4 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 cursor-pointer'>
              {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Login"}
            </button>
            : <button
              disabled={isLoading}
              onClick={handleSignup}
              className='bg-gradient-to-r from-green-400 to-emerald-500 w-full mt-5 py-3 px-4 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 cursor-pointer'>
              {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
            </button>

          }

        </div>
      </div>
      <div className='px-8 py-4 bg-gray-900/50 flex justify-center'>
        {loginBox ?
          <p className='text-sm text-gray-400'>
            Don't have an account? <span className='text-green-500 hover:underline cursor-pointer' onClick={handleSignupBox}>Sign Up</span>
          </p>
          :
          <p className='text-sm text-gray-400'>
            Already have an account? <span className='text-green-500 hover:underline cursor-pointer' onClick={handleLoginBox}>Login</span>
          </p>
        }
      </div>
    </div>
  )
}

export default AuthPage
