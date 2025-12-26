'use client'
import { getUserRole } from '@/actions/getUserRole';
import UserDashboard from '@/components/UserDashboard';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const page = () => {
    const {isLoaded , user} = useUser() ;
    

    const {data, isLoading , error} = useQuery({
        queryKey : ['get-user-role'],
        queryFn : getUserRole
    })

    
    if(!isLoaded || isLoading){ 
        return null
    }

    console.log("User Role in Dashboard Page :" , data) ;
  return (
    <>
    {
        data === "DEALER" ? (
            <div>
               Dealer Dashboard
            </div>
            
        ) : (
            <div>
               <UserDashboard /> 
            </div>
        )
    }
    </>
  )
}

export default page
