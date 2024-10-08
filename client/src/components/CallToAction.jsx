import React from 'react'
import {Button} from 'flowbite-react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>
        Want to learn more about JavaScript?
        </h2>
        <p className='text-gray-500 my-2'>
        Checkout these resources with 100 JavaScript Projects
        </p>
        <Button className='hover:via-cyan-400 rounded-tl-xl rounded-bl-none dark:bg-gradient-to-r from-gray-800 via-cyan-500 to-gray-800 bg-cyan-600 hover:bg-cyan-500 border-none'>
          <a href="https:/www.100jsprojects.com" target='_blank' rel='noopener noreferrer'>
          100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://www.shutterstock.com/image-vector/javascript-programming-language-script-code-260nw-1062509657.jpg" />
      </div>
    </div>
  )
}
