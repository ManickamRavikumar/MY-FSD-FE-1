import React from 'react'

function SearchBar() {
  return (
    <div className='flex justify-center'>
      <input className='border-2 boader-gray-300 py-2 px-2 rounded-md w-1/2'
       type="text" placeholder='search for food items'onChange={(e)=>setSearch(e.target.value)} />
    </div>
  )
}

export default SearchBar