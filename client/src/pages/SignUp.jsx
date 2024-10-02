import {Link} from 'react-router-dom'
import { TextInput, Label, Button } from 'flowbite-react';

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-2 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
        <Link
          to='/'
          className='font-bold
          Idark:text-white text-4xl'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
          Ivia-purple-500 to-pink-500 rounded-lg text-white'>
          Usama's
          </span>
          Blog
        </Link>
        <p className='mt-5 text-sm'>
          This is a demo project. You can Sign Up with your email, password or with Google
        </p>
        </div>
        {/* right */}
        <div className="flex-1">
        <form className='flex flex-col gap-4'>
          <div>
          <Label value='Your username' />
          <TextInput type='text' placeholder='Username' id='username'></TextInput>
          </div>
          <div>
          <Label value='Your email' />
          <TextInput type='text' placeholder='name@company.com' id='email'></TextInput>
          </div>
          <div>
          <Label value='Your password' />
          <TextInput type='text' placeholder='Password' id='password'></TextInput>
          </div>
          <Button gradientDuoTone='purpleToBlue' type='submit'>
            Sign Up
          </Button>
        </form>
          <div className='flex gap-2 mt-5 text-sm'>
              <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              SignIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
