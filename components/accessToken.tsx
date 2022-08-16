import { useSession } from "next-auth/react";

// this will need to generate a jwt for the backend api calls
// return role, id
export default function AccessToken() {
    const { data } = useSession();
    console.log(data)
    
}