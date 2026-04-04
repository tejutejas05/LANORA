import React from 'react'

const Card = ({title}) => {
  return (
    <div className='bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
        <h3 className='text-xl font-semibold'>{title}</h3>
    </div>
  )
}

export default Card;