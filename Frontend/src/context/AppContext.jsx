import { createContext,useEffect,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

  const AppContext=createContext()
const AppContextProvider=(props)=>{
     const [user,setUser]=useState(null)
     const [showLogin,setShowLogin]=useState(false )
      const [credit,setCredit]=useState(false)
     const backendUrl=import.meta.env.VITE_BACKEND_URL || 'https://imagify-u5gt.onrender.com'
     const token=localStorage.getItem('token')
     const logout=()=>{
      localStorage.removeItem('token')
      setUser('')
     }
     const loadCredits=async()=>{
      try{
       const {data}= await axios.get(backendUrl+'/api/user/credits',{headers:{token}})
        
        if(data.success){
          setCredit(data.credits)
          setUser(data.user)
        }
        console.log(data);
      }catch(error){
        toast.error(error.message)
      }
     }
     const generateImage=async(prompt)=>{
      try{
         const {data}= await axios.post(backendUrl+'/api/image/generate-image',{prompt},{headers:{token}})
         if(data.success){
            loadCredits()
            return data.resultImage
         }
         else{
          toast.error(data.message)
          loadCredits()
          if(data.creditBalance===0){
             toast.message('Insufficient Credits')
          }
         }
      }catch(error){
        toast.error(error.message)
      }

     }
     useEffect(()=>{
      if(token){
        loadCredits()
      }
     },[token])
     const value={
        user,setUser,showLogin,setShowLogin,backendUrl,credit,logout,loadCredits,generateImage
       
     }
      return(
            <AppContext.Provider value={value}>
            {props.children}
            </AppContext.Provider>
        )
}
export default AppContextProvider
export {AppContext}
