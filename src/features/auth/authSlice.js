import { createSlice } from "@reduxjs/toolkit"

// api ile bağşantı sağlamıyor fakat apiden  gelen token verilerinin kayıt işlemlerinde de kullanıylıor ve state kurulumunu yapıyor
const authSlice=createSlice({
    name:'auth',
    initialState:{token:null},
    reducers:{
        setCredentials:(state,action)=>{
            const {accessToken}=action.payload
            state.token=accessToken
        },
        logOut:(state,action)=>{
            state.token=null
        }
    }
})

export const {setCredentials,logOut}=authSlice.actions

export default authSlice.reducer

export const selectCurrentToken =(state)=>state.auth.token //optimizasyon mantığında veriye blunduğu konumda ulaşmk adına oluşturulan fonksiyonlardır