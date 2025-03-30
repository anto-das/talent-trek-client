/* eslint-disable react/prop-types */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import JobCard from './JobCard'
import { useEffect, useState } from 'react';
import axios from 'axios';

const TabCategories = () => {
  const [jobs,setJobs] = useState([]);
  const [category, setCategory] = useState("Web Development")
  useEffect(() =>{
    fetchAllJobsData(category)
  },[category])
  // fetch all data function
  const fetchAllJobsData = async (cat) =>{
    const {data } = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${cat}`)
    setJobs(data)
  }
  return (
    <Tabs>
      <div className=' container px-6 py-10 mx-auto'>
        <h1 className='text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl '>
          Browse Jobs By Categories
        </h1>

        <p className='max-w-2xl mx-auto my-6 text-center text-gray-500 '>
          Three categories available for the time being. They are Web
          Development, Graphics Design and Digital Marketing. Browse them by
          clicking on the tabs below.
        </p>
        <div className='flex items-center justify-center'>
          <TabList>
            <Tab onClick={() => setCategory("Web Development")}>Web Development</Tab>
            <Tab onClick={() => setCategory("Graphics Design")}>Graphics Design</Tab>
            <Tab onClick={() => setCategory("Digital Marketing")}>Digital Marketing</Tab>
          </TabList>
        </div>
        <TabPanel>
          <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {
          jobs.map(job => <JobCard key={job?._id} job={job}></JobCard>)
         }
          </div>
        </TabPanel>

        <TabPanel>
          <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {
          jobs.map(job => <JobCard key={job?._id} job={job}></JobCard>)
         }
          </div>
        </TabPanel>

        <TabPanel>
          <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {
          jobs.map(job => <JobCard key={job?._id} job={job}></JobCard>)
         }
          </div>
        </TabPanel>
      </div>
    </Tabs>
  )
}

export default TabCategories
