import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNoteById } from './notesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditNoteForm from './EditNoteForm' 

import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PuffLoader'


const EditNote = () => {
    //burada url den aldığımız id ile bir sorulama işlemi yapıyoruz
    const { id } = useParams()

    //const note = useSelector(state => selectNoteById(state, id)) // slice kısmında oluşturduğumuz takma ad alan fonksiyonu kullanarak önbellekten verilerimiz çağırıyoruz
    //const users = useSelector(selectAllUsers) //ve yine önbellek kullanmak adına oluşturduğumuz takma adlı fonkşsyonumuz çağıroyurz
//çağırılan yani kullanılan verilerin kaybolmaması adına. verilerimizin gerçekten orada olduğununda emin olmalıyız
//ön getirme bileşeni olan prefetch i kullanacağım

    const {username, isManager, isAdmin} = useAuth()

    const {note} = useGetNotesQuery("notesList",{
        selectFromResult:({data})=>({
            note: data?.entities[id]
        })
    })
    const {users} = useGetUsersQuery("usersList",{
        selectFromResult:({data})=>({
            users:data?.ids.map(data=>data?.entities[id])
        })
    })


   // const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    if(!note || !users?.lenght) return <PulseLoader color={"#FFF"} />

    if(!isManager || !isAdmin){
        if(note.username!==username){
            return <p className='errmsg'>No Access</p>
        }
    }
    const content = <EditNote note={note} users={users} />

    return content
}
export default EditNote