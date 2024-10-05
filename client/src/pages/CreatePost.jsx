import React from 'react'
import {TextInput, Select, Button, FileInput} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='max-w-3xl mx-auto p-3 min-h-screen'>
        <h1 className='text-center text-3xl my-2 font-semibold'>Create New Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
                <Select>
                    <option value="uncategorized">Select a Category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3'>
                <FileInput type='file' accept='image/*' />
                <Button type='button' outline size='sm' className='bg-cyan-400'>Upload Image</Button>
            </div>
            <ReactQuill theme='snow' placeholder='Write Something' className='h-72 mb-12'/>
            <Button type='submit' className='bg-gradient-to-r border-none from-slate-900 via-cyan-600 to-slate-950 hover:via-cyan-400'>Publish</Button>
        </form>
    </div>
  )
}
