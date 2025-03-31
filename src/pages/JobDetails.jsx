import { useContext, useEffect, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../providers/AuthProvider'
import axios from 'axios'
import { compareAsc, format } from 'date-fns'
import toast from 'react-hot-toast'

const JobDetails = () => {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useContext(AuthContext);
      const [job,setJobs] = useState({});
        useEffect(() =>{
          fetchAllJobsData()
          // eslint-disable-next-line 
        },[id])
        // fetch all data function
        const fetchAllJobsData = async () =>{
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/job/${id}`)
          setJobs(data)
        }
        const {  job_title,category,min_price, max_price, description,date,buyer,} = job || {}
        const handleSubmit = async (e) =>{
          e.preventDefault();
          const form = e.target;
          const email = user?.email;
          const price = parseInt(form.price?.value);
          const bidDescription = form.comment?.value;
          const jobId = id;
          const bidData = {jobId,price,bidDescription,email,date:startDate}
           //1. bid permissions validation
           if(user?.email === buyer?.email){
            return toast.error("Action not permitted")
          } 

          //2. price within maximum range validation
          if(price > max_price){
            return toast.error('offer less or at least equal to maximum price!')
          }
          //3. deadline crossed validation
          if(compareAsc(new Date(), new Date(date)) === 1) return toast.error("Deadline crossed biding forbidden")
          // 4.offered dealing within buyer deadline validation
        if(compareAsc(new Date(startDate), new Date(date)) === 1) return toast.error('Please offer within deadline')
          try{
        const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/add-bids`,bidData);
        // confirm data save in db
        if(data.acknowledged){

         // reset form
          form.reset()
          // navigate to my-bids page
          navigate('/my-bids')
          // successfully bids submit toast
          toast.success("your bid is successfully submitted")
        }
        } catch(error){
          toast.error(error.response.data)
        }
        }
  return (
    <div className='flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto '>
      {/* Job Details */}
      <div className='flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
       {job.date &&  <div className='flex items-center justify-between'>
          <span className='text-sm font-light text-gray-800 '>
            Deadline: {format(new Date(date),"P")}
          </span>
          <span className={`px-4 py-1 text-xs ${category === "Web Development" && ' text-blue-500 bg-blue-100/60'}
                        ${category === "Graphics Design" && ' text-pink-500 bg-pink-100/60'}
                        ${category === "Digital Marketing" && ' text-green-500 bg-green-100/60'} uppercase  rounded-full `}>
            {category}
          </span>
        </div>}

        <div>
          <h1 className='mt-2 text-3xl font-semibold text-gray-800 '>
            {job_title}
          </h1>

          <p className='mt-2 text-lg text-gray-600 '>
            {description}
          </p>
          <p className='mt-6 text-sm font-bold text-gray-600 '>
            Buyer Details:
          </p>
          <div className='flex items-center gap-5'>
            <div>
              <p className='mt-2 text-sm  text-gray-600 '>
                Name: {buyer?.name}
              </p>
              <p className='mt-2 text-sm  text-gray-600 '>
                Email:{buyer?.email}
              </p>
            </div>
            <div className='rounded-full object-cover overflow-hidden w-14 h-14'>
              <img
                src={`${buyer?.photo}`}
                alt=''
              />
            </div>
          </div>
          <p className='mt-6 text-lg font-bold text-gray-600 '>
          Range: ${min_price} - ${max_price}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className='p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Place A Bid
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='price'>
                Price
              </label>
              <input
                id='price'
                type='text'
                name='price'
                required
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'
                defaultValue={user?.email}
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='comment'>
                Comment
              </label>
              <input
                id='comment'
                name='comment'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
          </div>

          <div className='flex justify-end mt-6'>
           {user?.email !== buyer?.email && <button
              type='submit'
              className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >
              Place Bid
            </button>}
          </div>
        </form>
      </section>
    </div>
  )
}

export default JobDetails
