import Common_Form from '@/components/Common/Common_Form'
import { registerFormControls } from '@/Config/Index.jsx'
import { useToast } from '@/hooks/use-toast'


import { registerUser } from '@/Store/auth-slice/Index'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
const initialState = {
  username: '',
  email: '',
  password: '',
}
const [formData, setFormData] = useState(initialState)
const dispatch = useDispatch()
const navigate = useNavigate()
const { toast } = useToast()


function onSubmit(e){
  e.preventDefault();
  // console.log(formData);
  dispatch(registerUser(formData)).then((data)=> {
    if (data?.payload?.success) {
      toast({
        title: data?.payload?.message,
      });
      navigate("/auth/login");
    } else {
      toast({
        title: data?.payload?.message,
        variant: "destructive",
      });
    }
  });
}



console.log(formData);

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Create new account</h1>
        <p className='mt-2'>Already have an Account
          <Link className='font-medium ml-2 text-primary hover:underline' to='/auth/login'>Login</Link>
        </p>
      </div>
      <Common_Form formControls={registerFormControls}
      buttonText={'Sign Up'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}></Common_Form>
    </div>
  )
}

export default Register
