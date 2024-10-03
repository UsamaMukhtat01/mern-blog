import {Link, useNavigate} from 'react-router-dom'
import { TextInput, Label, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out the all fields')
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup',{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        setLoading(false);
        return setErrorMessage(data.message)
      }
      if(res.ok){
        navigate('/sign-in');
      }
    }catch(error){
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

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
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
          <Label value='Your username' />
          <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}></TextInput>
          </div>
          <div>
          <Label value='Your email' />
          <TextInput type='text' placeholder='name@company.com' id='email' onChange={handleChange}></TextInput>
          </div>
          <div>
          <Label value='Your password' />
          <TextInput type='text' placeholder='Password' id='password' onChange={handleChange}></TextInput>
          </div>
          <Button className='bg-gradient-to-br from-green-400 to-blue-600' type='submit' disabled={loading}>
            {loading? (
              <>
              <Spinner size='sm'/>
              <span className='pl-3'>Loading...</span>
              </>):
            ('Sign Up')}
          </Button>
          <OAuth/>
          { errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
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
