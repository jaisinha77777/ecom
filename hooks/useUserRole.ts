import { getUserRole } from "@/actions/getUserRole";
import { useQuery } from "@tanstack/react-query";

 

export const useUserRole = () => {
    const {data, isLoading , error} = useQuery({
        queryKey : ['get-user-role'],
        queryFn : getUserRole
    })
    return {data, isLoading, error} ;
}