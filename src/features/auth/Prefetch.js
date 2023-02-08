import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
//react wuery deki verileri güncelellemek adına bir middleware gibi kullnacağız 
//işlem yapacağımız sayfaların veri güncelllenemesinde kullnacağız
//app.js de çağrılarak verilleriini güncel tutmak istediğimiz sayfaları route içerine alacağız
// bu sayfalara gitmek istediğimiz zaman çalışacak
const Prefetch = () => { //route işleminde Prefect bileşenini kullanırken verinin kaybolmasını istemediğimiz(abone olacağımız) sayfaları kapsayacak şekilde kullanmalıyız
    //verinin korunduğu sayfalardan yani Prefetch(önceden getir) bileşenimizin kapsadığı sayfalardan ayrıalcak olursak veri koruma işlemi son bulacaktır
    //sayfayı yeniledğimizde ve formalarımızı önceden doldruduğumuzda da dahil hala bu duruma sahip olmak istiyoruz 
    useEffect(() => {
        console.log('subscribing')
        // const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        // const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        store.dispatch(notesApiSlice.util.prefetch('getNotes','notesList',{force:true}))
        store.dispatch(notesApiSlice.util.prefetch('getUsers','usersList',{force:true}))

        // return () => { //prefetch in kapsadığı sayfalardan ayrıldığımızda veriyi temizleme işini yapıyoruz
        //     console.log('unsubscribing')
        //     notes.unsubscribe()
        //     users.unsubscribe()
        // }
    }, [])//katı bir useEffect kullanacağız [] mount, unmount ve remount modlarında çalışacak

    return <Outlet />
}
export default Prefetch