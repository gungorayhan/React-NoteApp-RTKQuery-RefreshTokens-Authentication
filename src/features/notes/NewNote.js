
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from "react-spinners/PulseLoader"
const NewNote = () => {
    //const users = useSelector(selectAllUsers)

    const {users} = useGetUsersQuery("usersList",{
        selectFromResult:({data})=>({
            users:data?.ids.map(id=>data?.entities[id])
        })
    })

    //eğer bir kullanıcımız var ise işelmelrimizi gerçekleştireceğiz
    //gelen verileri sayfalarda kullanmdan önce herzaman kontrol edeceğiz
    //verinin olmas ve ya olmaması durumuna göre sayfaya return edeceğiz content önem kazanmakatadır
    if (!users?.length) return<p>Not Currently Available</p>

   // const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>
    const content =<NewNoteForm users={users} />
    return content
}
export default NewNote