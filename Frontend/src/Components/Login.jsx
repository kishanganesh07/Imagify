import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
const Login = () => {
    const [state,setState]=useState('Login')
    const {setShowLogin,backendUrl,setUser}=useContext(AppContext)
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const onSubmitHandler=async (e)=>{
        e.preventDefault()
        try{
            if(state==='Login'){
             const data= await fetch(backendUrl+'/api/user/login',{
                    method:"POST",headers:{
                        'Content-Type':"application/json",
                    },
                    body:JSON.stringify({email,password}),
                })
                console.log(data)
                const response=await data.json()
                if(response.success){
                    setUser(data)
                    localStorage.setItem('token',response.token)
                    setShowLogin(false)
                    toast.success('Login Successful')
                }
                else{
                    toast.error(response.message)
                     
                }
            }
            else{
                  const data= await fetch(backendUrl+'/api/user/register',{
                    method:"POST",headers:{
                        'Content-Type':"application/json",
                    },
                    body:JSON.stringify({name,email,password}),
                })
                console.log(data)
                 const response = await data.json()
                console.log(response)
                if(response.success){
                    setUser(data)
                    localStorage.setItem('token',response.token)
                    setShowLogin(false)
                    toast.success('Registeration Successful')
                }
                else{
                    toast.error(response.message)
                }
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        document.body.style.overflow='hidden'
        return ()=>{
            document.body.style.overflow='auto'
        }
    })
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
       <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue.</p>

        {state!=='Login'&&<div className='border px-2 py-2 flex items-center gap-2 rounded-md mt-5'>
            <img src={assets.profile_icon} width={20} alt="" />
            <input className='outline-none text-sm' name='name' type="text" placeholder='Full Name' onChange={e => setName(e.target.value)} value={name} required />
        </div>}
        <div className='border px-2 py-2 flex items-center gap-2 rounded-md mt-5'>
            <img src={assets.email_icon} width={20} alt="" />
            <input className='outline-none text-sm' name='email' type="email" placeholder='Email id' onChange={e => setEmail(e.target.value)} value={email} required />
        </div>
        <div className='border px-2 py-2 flex items-center gap-2 rounded-md my-5'>
            <img src={assets.lock_icon} width={18} alt="" />
            <input className='outline-none text-sm' name='password' type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} required />
        </div>
        {/* <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forget password?</p> */}
        <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state==='Login'?'Login':'Create Account'}</button>
        {state==='Login'?<p>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign Up')}>Sign Up</span></p>: <p className='mt-2'>Already have an account? <span className='text-blue-600 cursor-pointer'onClick={()=>setState('Login')}>Login</span></p>}
        
        
        <img src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' onClick={()=>setShowLogin(false)}/>
        </form> 
    </div>
  )
}

export default Login
