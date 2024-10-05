import {Link, useNavigate} from 'react-router-dom'
import { TextInput, Label, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice'
import OAuth from '../components/OAuth';

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim() })
  }
  console.log(formData)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill out the all fields'))
    }
    try{
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        
        dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/');
      }
    }catch(error){
      dispatch(signInFailure(error.message))
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
            ('Sign In')}
          </Button>
          <OAuth/>
          { errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
        </form>
          <div className='flex gap-2 mt-5 text-sm'>
              <span>Don't Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
