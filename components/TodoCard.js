import React, { useState } from 'react'
import { MdDone } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import CountdownTimer from './CountdownTimer';
import { RxCross2 } from "react-icons/rx";
import { BsGraphDownArrow } from "react-icons/bs";
import toast from 'react-hot-toast';


const TodoCard = (props) => {
    const [isEdit, setisEdit] = useState(false)
    const [dateTime, setDateTime] = useState({
        date: '',
        time: ''
    });
    const [mytitle, settitle] = useState('');
    const [myText, setmyText] = useState('')

    const { data, handleMarkAsUnDone, handleDelete, handlePriority, handleEdit } = props
    const { completed, deadline, text, title, _id, priority } = data
    const date = new Date(deadline)
    const dateNow = new Date()
    const totalDays = ((date - dateNow) / (1000 * 3600 * 24))
    const days = Math.floor(totalDays);
    const hours = Math.floor((totalDays - days) * 24);
    const minutes = Math.floor(((totalDays - days) * 24 - hours) * 60);
    const seconds = Math.floor((((totalDays - days) * 24 - hours) * 60 - minutes) * 60);

    const handleMarkAsUnDoneInHere = () => {
        handleMarkAsUnDone(_id)
    }

    const handleDeleteInHere = () => {
        handleDelete(_id)
    }

    const handlePriorityInHere = () => {
        handlePriority(_id)
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

    const handleTitle = (e) => {
        settitle(e.target.value)
    }
    const handleText = (e) => {
        setmyText(e.target.value)

    }
    const handleEditInHere = () => {
        const myObj = {
            id: _id,
            title: mytitle,
            text: myText,
            deadline: handleSubmitDateTime()
        }

        handleEdit(myObj);
    }
    return (
        <div className='bg-white shadow-2xl rounded-xl h-auto  w-10/12 p-5 flex flex-col gap-2 my-2'>

            <div className='flex items-center gap-4 w-auto justify-between '>
                {
                    isEdit ? <input type='text' placeholder={title} className='text-black my-1 border-black focus:outline-none bg-slate-200 w-72 px-3 py-1' onChange={handleTitle} value={mytitle} /> : <h1 className='text-black font-semibold text-lg'>{title}</h1>
                }
                {
                    isEdit ? <div className='flex gap-1'>
                        <input type='date' className='text-black my-1 border-black focus:outline-none bg-slate-200 w-auto px-3 py-1' value={dateTime.date} onChange={handleDateChange} />
                        <input type='time' className='text-black my-1 border-black focus:outline-none bg-slate-200 w-auto px-3 py-1' value={dateTime.time} onChange={handleTimeChange} />
                    </div> : <CountdownTimer deadline={deadline} />
                }
            </div>
            {
                isEdit ? <textarea style={{ height: '150px' }} className='text-black my-1 border-black focus:outline-none bg-slate-200  px-3 py-1' placeholder={text} onChange={handleText} value={myText}></textarea> : <p className='text-black text-sm'>{text}</p>
            }
            {
                !isEdit && <div className='p-3 flex  gap-2 justify-between mt-2'>
                    {
                        completed ? <div className="tooltip tooltip-right" data-tip="Mark as UnDone">
                            <button className=' bg-red-400 rounded-full p-2'><RxCross2 className='text-base text-white' onClick={handleMarkAsUnDoneInHere} /></button>
                        </div> : <div className="tooltip tooltip-right" data-tip="Mark as Done">
                            <button className=' bg-green-400 rounded-full p-2'><MdDone className='text-base text-white' onClick={handleMarkAsUnDoneInHere} /></button>
                        </div>
                    }
                    <div className="tooltip tooltip-right" data-tip="Edit">
                        <button className=' bg-slate-400 rounded-full p-2' onClick={() => { setisEdit(!isEdit) }}><MdEdit className='text-base text-white' /></button>
                    </div>
                    {
                        priority ? <div className="tooltip tooltip-right" data-tip="Set as Not High Priority">
                            <button className='  bg-rose-500 rounded-full p-2' onClick={handlePriorityInHere}><BsGraphDownArrow className='text-base text-white' /></button>
                        </div> : <div className="tooltip tooltip-right" data-tip="Set as High Priority">
                            <button className='  bg-emerald-400 rounded-full p-2' onClick={handlePriorityInHere}><BsGraphUpArrow className='text-base text-white' /></button>
                        </div>
                    }
                    <div className="tooltip tooltip-left" data-tip="Delete">
                        <button className=' bg-red-400 rounded-full p-2' onClick={handleDeleteInHere}><MdDelete className='text-base text-white' /></button>
                    </div>

                </div>
            }
            {
                isEdit && <div className='  p-2 flex justify-end'>
                    <button className=' hover:bg-green-400 text-black hover:text-white  px-3 py-2 font-semibold rounded-md' onClick={handleEditInHere}>Save Changes</button>
                </div>
            }
        </div>
    )
}

export default TodoCard
