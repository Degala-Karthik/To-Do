import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export const SignupPage = () => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [status, setstatus] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            setstatus(true)
            console.log(username)
            console.log(password)
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            })

            const data = await response.json();
            if (response.status === 200) {
                toast.success('Signuped Successfully')
                navigate('/login')
            }
            else {
                toast.error(data.message)
                setusername('');
                setpassword('')
                setstatus(false)
            }
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
            setstatus(false)
        }
    }
    const token = Cookies.get("userId");
    if (token !== undefined) {
        return <Navigate to="/" />;
    }

    return (
        <div className=' h-screen bg-gray-200  flex  justify-center items-center'>
            <div className='h-auto w-1/4 bg-white shadow-2xl rounded-lg p-6 flex flex-col gap-2'>
                <h1 className='font-bold text-lg text-black mb-2'>Create Account</h1>
                <input type='text' placeholder='UserName' className='rounded-lg my-1 border-black focus:outline-none bg-slate-200 w-full  px-4 py-2 text-black' onChange={(e) => { setusername(e.target.value) }} value={username} />
                <input type='password' placeholder='Password' className='rounded-lg my-1 border-black focus:outline-none bg-slate-200 w-full px-4 py-2 text-black' onChange={(e) => { setpassword(e.target.value) }} value={password} />
                {
                    status ? <div className='flex justify-center bg-white py-1 my-2'><span className="loading loading-dots loading-md text-green-400 "></span></div> : <button className=' bg-green-600 font-bold text-white py-1 my-2 rounded-lg' onClick={handleSignup}>Signup</button>
                }
                <Link to='/login' className='text-sm self-end'><p >Already have an Account <span className='underline'>Login?</span></p></Link>
            </div>
        </div>
    )
}
