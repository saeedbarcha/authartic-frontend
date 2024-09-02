import React from 'react'

const Unauthorized = () => {
    return (
        <div className='w-screen h-screen flex flex-col justify-center bg-black text-white text-center'>
            <span className='m-5 text-xl font-bold font-kodchasan'>Unauthorized!</span>
            <div className='w-full h-full flex items-center justify-center'>
                <span className='text-xl font-bold font-KoHo'>Access Denied 404</span>
            </div>
        </div>
    )
}

export default Unauthorized
