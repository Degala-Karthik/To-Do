import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TodoCard from './TodoCard';
import AddTodo from './AddTodo';

export const Home = () => {

    const [dataFetched, setdataFetched] = useState([]);
    const [isData, setisData] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const [type, settype] = useState('getAllTodo')
    const [addtodo, setaddtodo] = useState({
        clicked: false,
        // loading: false,
    })

    const navigate = useNavigate();

    const handleSelection = (e) => {
        settype(e.target.value)
        setdataFetched([])
    }
    const userId = Cookies.get("userId");
    useEffect(() => {
        if (userId === undefined) {
            navigate('/login');
            return
        }
        getData();
    }, [type])

    if (userId === undefined) {
        navigate('/login');
        return
    }

    const getData = async () => {
        try {
            setisLoading(true)
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: userId
                })
            })
            const data = await response.json();
            if (response.status === 200) {
                setdataFetched(data)
                if (data.length > 0) {
                    setisData(true)
                }
                else {
                    setisData(false)
                }
            }
            else {
                toast.error("Failed to fetch")
            }
            setisLoading(false)
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
            setisLoading(false)
        }
    }
    const handleLogout = () => {
        Cookies.remove("userId");
        toast.success("Logged out.!")
        navigate('/login')
    }

    const handleMarkAsUnDone = async (id) => {
        try {
            const toastId = toast.loading('Making Changes...');
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/markAsDoneAndUnDone/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId
                })
            })

            const data = await response.json();
            if (response.status === 200) {
                toast.dismiss(toastId)
                toast.success(data.message)
                getData()
            }
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
        }
    }

    const handleDelete = async (id) => {
        try {
            const toastId = toast.loading('Making Changes...');
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/deleteTodo/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId
                })
            })
            const data = await response.json();
            if (response.status === 200) {
                toast.dismiss(toastId)
                toast.success(data.message)
                getData()
            }
            else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
        }

    }
    const handlePriority = async (id) => {
        try {
            const toastId = toast.loading('Making Changes...');
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/highPrioritNotHighPriority/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId
                })
            })
            const data = await response.json();
            if (response.status === 200) {
                toast.dismiss(toastId)
                toast.success(data.message)
                getData()
            }
            else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
        }
    }

    const handleEdit = async (myObj) => {
        try {
            const toastId = toast.loading('Making Changes...');
            const { id, title, text, deadline } = myObj;
            const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/editTodo/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    text,
                    deadline,
                    userId
                })
            })

            const data = await response.json();
            if (response.status === 200) {
                toast.dismiss(toastId)
                toast.success(data.message)
                getData()
            }
            else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Server is not the best version. Try again after sometime..!")
        }
    }
    return (
        <div className=' grid grid-cols-10 h-auto'>
            <div className=' col-span-2  h-screen flex flex-col p-10 gap-4 ' >
            </div>
            <div className='col-span-7 flex flex-col p-10'>
                <div className='px-4 w-full mb-4 flex gap-3 '>
                    <select className='  py-2 rounded-lg w-auto bg-white text-black font-semibold border-2 px-6 border-black focus:outline-none' onChange={handleSelection}>
                        {/* <option select>Select</option> */}
                        <option select={true} value={'getAllTodo'}>All</option>
                        <option value={'getInProgressTodo'}>In Progress</option>
                        <option value={'getHighPriorityTodo'}>High Priority</option>
                        <option value={'getCompletedTodo'}>Completed</option>
                    </select>
                    {
                        addtodo.clicked ? <button onClick={() => { setaddtodo({ clicked: !addtodo.clicked }) }} className='text-black font-medium text-xl w-1/2 py-2 rounded-lg hover:bg-red-400 hover:text-white text-center' >Cancel</button> : <button onClick={() => { setaddtodo({ clicked: !addtodo.clicked }) }} className='text-black font-medium text-xl w-1/2 py-2 rounded-lg hover:bg-green-400 hover:text-white text-center' >Add Todo</button>
                    }
                    <button className='text-black font-medium text-xl w-1/2 py-2 rounded-lg hover:bg-red-400 hover:text-white' onClick={handleLogout}>Logout</button>
                </div>
                {
                    addtodo.clicked && <AddTodo setaddtodo={setaddtodo} getData={getData} />
                }
                {
                    isData ? <>
                        {
                            isLoading ? <div className='flex flex-col justify-center items-center p-10 h-1/2'><span className="loading loading-dots loading-lg text-green-400"></span></div> : <>{dataFetched.map((i) => (
                                <TodoCard data={i} handleMarkAsUnDone={handleMarkAsUnDone} handleDelete={handleDelete} handlePriority={handlePriority} handleEdit={handleEdit} key={i._id} />
                            ))}</>
                        }
                    </> : <div className='flex flex-col justify-center items-center p-10 h-1/2'>
                        <h1>No Items available, Switch to other to see items</h1>
                    </div>
                }
            </div>
            <div className=' col-span-1  h-screen flex flex-col p-10 gap-4 ' >
            </div>
        </div>
    )
}


