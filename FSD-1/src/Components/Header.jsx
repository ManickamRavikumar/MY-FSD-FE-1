import React from 'react'

function Header() {
  return (
     <div className='bg-[url(/assets/header_img.png)]  h-64 flex items-center  bg-cover bg-center rounded-lg shadow-lg'>
            <div className='w-full max-w-2xl px-4 sm:px-8 py-6  bg-opacity-50 rounded-lg  '>
                <h1 className='text-2xl sm:text-3xl font-bold text-red-50 mb-4'>Order your favourite food here</h1>
                <p className='text-white mb-4'>choose from a diverse menu featuring a delectable array of dishes crafted with the finest
                    ingredints and elevate your dining experience,one delicious meal at a time
                </p>
                <button className=' font-bold border-2 '>View Menu</button>
            </div>
        </div>
  )
}

export default Header