// gerekli icon ve data sayfalarının importları yapılacak
// yöndelerimek adına navigate yüklüyoruz

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
//data seçmek için useSelector ve datayı getirmek adına selectUserById fonksiyonunu çağırıyoruz
//data çağırma fonksiyonu ApiSlice seviyesinde yazıyoruz ki data sorgulaması daha hızlı ve daha az render işleminden geçerek görüntülemek amaçlı
//arayüzden api a bağlanarak verilerimizi çekiyoruz ve arayüzde componenetler ve parçalı olarak oluşturuduğumuz görüntüleme durumlarıyla clint tarafına verilerimizi sunuyoruz
//verilere ulaşmak adına amaca yönelik fonksiyonlar yazarak görüntüleme sayfalarıonda bu yazdığımız fonksiyonlarımızı kullanıyoruz
//kodlarımızı yazmadan öncelikle yapacağımız işlemlerin kurgusunu yapmalıyız. bu bize daha yapısal ve fonksiyonel bir yapı kurmamıza olanak sağlayacaktır.


// import { useSelector } from 'react-redux'
// import { selectNoteById } from './notesApiSlice'

import {useGetNotesQuery} from "./notesApiSlice"

const Note = ({noteId}) => {

    //const note = useSelector(state=>selectNoteById(state,noteId))
    const {note} = useGetNotesQuery("notesList",{
        selectFromResult:({data})=>({
            note:data?.entities[noteId]
        }),
    })

    const navigate=useNavigate()
 
    if(note){
        const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/notes/${noteId}`)

        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {note.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{note.title}</td>
                <td className="table__cell note__username">{note.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    }else return null
}

const memorizedNote= memo(Note)

export default memorizedNote