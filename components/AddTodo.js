import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';


const AddTodo = (props) => {
    const { setaddtodo, getData } = props
    const [dateTime, setDateTime] = useState({
        date: '',
        time: ''
    });
    const [mytitle, settitle] = useState('');
    const [myText, setmyText] = useState('')

    const userId = Cookies.get("userId")

    const handleTitle = (e) => {
        settitle(e.target.value)
    }
    const handleText = (e) => {
        setmyText(e.target.value)

    }
    const handleDateChange = (event) => {
        setDateTime({ ...dateTime, date: event.target.value });
    };

    const handleTimeChange = (event) => {
        setDateTime({ ...dateTime, time: event.target.value });
    };

    const handleSubmitDateTime = () => {
        if (dateTime.date && dateTime.time) {
            const dateTimeString = `${dateTime.date}T${dateTime.time}:00Z`;
            const convertedDateTime = new Date(dateTimeString);
            const offsetInMinutes = -5 * 60 - 30;
            convertedDateTime.setMinutes(convertedDateTime.getMinutes() + offsetInMinutes);
            const isoDateTime = convertedDateTime.toISOString();

            return isoDateTime;
        } else {
            toast.error('Please select both date and time');
        }
    }

    const handleAddtodo = async () => {
        const toastId = toast.loading("Adding...!")
        if (!mytitle || !myText) {
            toast.dismiss(toastId)
            toast.error("All Feilds are required")

            return
        }

        const response = await fetch(`https://todobackend-6hfe.onrender.com/api/todo/addTodo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                title: mytitle,
                text: myText,
                deadline: handleSubmitDateTime()
            })
        })

        const data = await response.json();
        if (response.status == 200) {
            toast.dismiss(toastId)
            toast.success("Item added")
            getData()
            setaddtodo({ clicked: false })
        }
        else {
            toast.dismiss(toastId)
            toast.error("Failed to Add")
        }
        toast.dismiss(toastId)
    }
    return (
        <div className='bg-white shadow-2xl rounded-xl h-auto  w-10/12 p-5 flex flex-col gap-2 my-2'>

            <div className='flex items-center gap-4 w-auto justify-between '>
                <input type='text' placeholder='Title' className='text-black my-1 border-black focus:outline-none bg-slate-200 w-72 px-3 py-1' onChange={handleTitle} value={mytitle} />
                <div className='flex gap-1'>
                    <input type='date' className='text-black my-1 border-black focus:outline-none bg-slate-200 w-auto px-3 py-1' value={dateTime.date} onChange={handleDateChange} />
                    <input type='time' className='text-black my-1 border-black focus:outline-none bg-slate-200 w-auto px-3 py-1' value={dateTime.time} onChange={handleTimeChange} />
                </div>
            </div>
            <textarea className='text-black my-1 border-black focus:outline-none bg-slate-200  px-3 py-1' placeholder='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries' onChange={handleText} value={myText} style={{ height: '150px' }}></textarea>
            <button className=' self-end text-black hover:bg-green-400 px-4 py-1 hover:text-white rounded-lg' onClick={handleAddtodo}>Add</button>

        </div>
    )
}

export default AddTodo;
