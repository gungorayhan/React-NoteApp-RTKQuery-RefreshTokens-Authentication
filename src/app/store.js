import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth:authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: false
})

setupListeners(store.dispatch) // burada bazı verilerimizi düzenli olarak yenilemek adına setupListener kullanıyoruz.
//sadece setupListener ile kalmıyoruz. örnek useGetUsersQuery fonksiyonumuz nerede kullanıyor ise oraya giderek bazı eklemeler yapıyoruz
//Listener ile çalışmamaız durumunda sayfada başka sekmede işlem yapsak dahi tekrar bir önceki sekmeye geçtiğimizde güncel verileri görmüş oluruz

// {data=users,
//isLoading,isSuccess,isError,error}=useGetUsersQuery(undefined veya null kullanabiliriz(her ikisi için ise undefined kullan),{
//     pollingInterval:15000,
//     refetchOnFocus:true, odakta yeniden kontrol aralığı parametresi
//     refetchOnMountOrArgChange:true}) yükleme değiştirme durumlarında tepki parametre durumu
//oda başka bir pencereye koyar ve tarayıcı pencermize yeniden geri dönerisek doğru verilere bakıyor olacağız