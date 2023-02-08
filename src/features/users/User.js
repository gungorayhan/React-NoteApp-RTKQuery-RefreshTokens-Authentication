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
// import { selectUserById } from './usersApiSlice'
import { useGetUsersQuery } from './usersApiSlice'


const User = ({userId}) => {
    // const user =useSelector(state=>selectUserById(state,userId))

    const {user}=useGetUsersQuery("usersList",{
        selectFormResult:({data})=>({
            user: data?.entities[userId]
        }),
    })


    const navigate=useNavigate()

  if(user){
    //useredit sayfası oluşturulacak burada user bilgilrei çekilerek edit yapılacak. sayfanın bağlantı kısmı burada oluşturuyoruz
    const handleEdit=()=>navigate(`/dash/users/${userId}`)
    //tabloda user rollerini öncelikle string yapıyoruz sonrasında virgüllleri virgül boşluk ile değiştiriyoruz
    const userRolesString= user.roles.toString().replaceAll(',',', ')

    const cellStatus= user.active?'' :'table__cell--inactive'

    return(
        <tr className='table__row user'>
            <td className={`table__cell ${cellStatus}`}>
                {user.username}
            </td>
            <td className={`table__cell ${cellStatus}`}>
                {userRolesString}
            </td>
            <td className={`table__cell ${cellStatus}`}>
                <button className={`icon-button table__button`}
                onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    )

  }else return null
}

const memorizedUser=memo(User)

export default memorizedUser