import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationItem = ({item}) => {
  const [expnaded, setExpanded] = useState(false);
  return (
    <div onClick={() => setExpanded(!expnaded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
        <div className='flex justify-between items-center gap-4'>
            <div>
                <h2>{item.prompt}</h2>
                <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] py-1 px-4 rounded-full'>{item.type}</button>
        </div>
        {
            expnaded && (
                <div>
                    {item.type === 'image' ? (
                        <div>
                            <img src={item.content} alt="creation content" className='mt-3 w-full max-w-md' />
                        </div>
                    ) : (
                        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                            <div>
                                {item.content}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    </div>
  )
}

export default CreationItem