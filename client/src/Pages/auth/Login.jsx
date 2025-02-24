import Common_Form from '@/components/Common/Common_Form'
import { loginFormControls } from '@/Config/Index.jsx'
import { useToast } from '@/hooks/use-toast'
import { loginUser } from '@/Store/auth-slice/Index'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
const initialState = {
  email: '',
  password: '',
}
const [formData, setFormData] = useState(initialState)
const dispatch = useDispatch()
const { toast } = useToast()
const navigate = useNavigate()

function onSubmit(e){
  e.preventDefault();
  // console.log(formData);
  dispatch(loginUser(formData)).then((data)=> {
    // console.log(data);
    if (data?.payload?.success) {
      toast({
        title: data?.payload?.message,
      }); 
      navigate("/");
    } else {
      toast({
        title: data?.payload?.message,
        variant: "destructive",
      });
    }
  });
 
}
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign in to your Account</h1>
        <p className='mt-2'>Don't have an Account
          <Link className='font-medium ml-2 text-primary hover:underline' to='/auth/register'>Register</Link>
        </p>
      </div>
      <Common_Form formControls={loginFormControls}
      buttonText={'Sign In'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}></Common_Form>
    </div>
  )
}

export default Login

