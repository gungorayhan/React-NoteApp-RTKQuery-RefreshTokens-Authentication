import {useSelector} from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

//sayfalarda filtreleme ve kullancının yetkilerine göre görüntüleme ve işlem yapma yetkisi verilmektedir
// gelen tpken verisi burada çözümlenerek hook oluşturuluyor ve diğer sayflarda bu hook yardımı ile bilgi taşınıyor 
// taşınan bilgiden koşullar oluşturularak sayfa yönetimleri ve kullanıcı yetkileri yönetiliyor

const useAuth = () => {

    const token =useSelector(selectCurrentToken) // auth.token ->  verisine daha önceoluşturuduğumzu fonksşyon ile ulaşıypruz
    let isManager = false
    let isAdmin = false
    let status ="Employee"
    

    if(token){
        const decoded = jwtDecode(token)
        const {username,roles} = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        
        if(isManager) status ='Manager'
        if(isAdmin) status = 'Admin'

        return {username, roles, status, isManager, isAdmin }
    }

  return {username:'', roles:[], isManager, isAdmin, status}
}

export default useAuth