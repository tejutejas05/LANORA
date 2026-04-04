import React from 'react'
import Card from '../components/Card';


function Dashboard ()  {
  const data=["Total executions", "active runtime", "total agents "];
    return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h2 className='text-2xl font-bold mb-6'>Dashboard</h2>

    <div className='grid grid-cols-3 gap-6'> 
        {data.map((item,index)=> ( 
            <Card key={index} title={item}/>
        ))}
    </div>
    </div>
  )
}

export default Dashboard;
