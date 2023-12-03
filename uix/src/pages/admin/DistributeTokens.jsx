import { useEffect } from "react";

const DistributeTokens = () => {
    useEffect(() => {
        const getUsers = async () => {
            const getUserApiRes = await fetch(`http://localhost:3300/get/allUsersExceptAdmins/`, {
                method: 'GET',
                
            });
        }

        getUsers();
    },[])

    
    return (
        <>

        </>
    );

}
export default DistributeTokens;