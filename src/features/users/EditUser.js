import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserById } from "./usersApiSlice"
import EditUserForm from "./EditUserForm"

import { useGetUsersQuery } from "./usersApiSlice"
import { PulseLoader } from "react-spinners"

const EditUser = () => {
    const {id} =useParams()

    //const user=useSelector(state=>selectUserById(state,id))

    const {user} = useGetUsersQuery("usersList",{
      selectFromResult:({data})=>({
        user:data?.entities[id]
      })
    })
    //const content = user ? <EditUserForm user={user}/>:<p>Loading...</p>

    if(!user) return <PulseLoader color={"#fff"} />

    const content =<EditUser user={user}/>
    
  return content
}

export default EditUser