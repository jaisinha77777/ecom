'use client'
import { getUserRole } from '@/actions/getUserRole';
import UserDashboard from '@/components/UserDashboard';
import { useUserRole } from '@/hooks/useUserRole';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const page = () => {
  return (
            <div>
               <UserDashboard /> 
            </div>
        
  )
}

export default page
