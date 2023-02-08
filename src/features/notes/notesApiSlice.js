import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const notesAdapter = createEntityAdapter({
    sortComparer:(a,b)=>(a.completed ===b.completed) ? 0 : a.completed ? 1 : -1  //gelen verilerimiz sıralamasını yaptık (desc - asc)
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () =>({
                url: '/notes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError//herzaman 200 kodu geliyor biz ek olarak result ile bir hata olmadığının kontrolünü yapıyoruz
                },
            }),
            //keepUnuseDataFor -> verileri aktif olarak kullanmadığımızda 5sn boyunca tutacak sonrasında verilerin kaybolduğunu göreceğz.
            //kaybolan verileri getirmek adına tekrar query fonksiyonunu kullanmak zorunda kalacağız
            //keepUnusedDataFor: 5, // verileri 5sn kadar tut. sadece geliştirme ksımında yapılıyor!!!!!!!!!!!!!!!!varsayılan 60 sn
            transformResponse: responseData => {//apiden dönen yanıtı burada alıyoruz
                const loadedNotes = responseData.map(note => {
                    note.id = note._id //kullanılan verileri daha doğru olması adına gelen _id verisini daha önceden gelen id verisine eşitliyoruz
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes)//ve burada bağdaştırıcıyı kullanarak. herşeyi ayarla diyoruz. normalleştirilmiş tüm verilerimizi initialstate e aktardık
            },
            providesTags: (result, error, arg) => {//yalnızca geçersiz kılınabilicek etiketleri sağlar. 
                //burada kimlikleri olmayan bir sonuç alabilirsiniz
                //muhtemel bir hata oluştu veya nasıl başa çıkacağımı beklemediğniz bir şey var
                if (result?.ids) {//isteğe bağlı zincirleme bir ids özelliği olup olmadığını kontrol ediyorum
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))//yanlış gelen idleri burda düzelterek tekrar geri gönderiyorum 
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]//yok ise sadece iade ediyorum
            }
        }),
        addNewNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
        }),
        updateNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: (result, error, arg) => [//daha önce oluşturulan bellekteki verilerin kimliklerinin geçersiz kılınacağından tekrar oluşturmasını istiyoruz
            //tekrar kimlik oluşturma işlemi sadece patch ve delete işlemlerinde geröekleşmektedir
                { type: 'Note', id: arg.id }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `/notes`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select() //zincirleme bir işlem sonrasında apidilimini kullanarak getNotes dan gelen tüm verileri seçiyoruz 

// creates memoized selector 
const selectNotesData = createSelector( // bir seçici uyarısı oluşturuyoruz ve bu sonucu iletiyoruz
    selectNotesResult, //getNotes dan gelen verileri seçiyoruz
    notesResult => notesResult.data // kullanır hale gelenv eriyi tam anlamıyla burada görebiliyoruz.
    // verimizi dışa aktarmıyoruz sonraki işlem basamağında kullanacağız
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {//takma adlarla yeniden adlandırıyoruz
    selectAll: selectAllNotes,//tüm notları seç
    selectById: selectNoteById,//tüm notları kimliğe göre seç
    selectIds: selectNoteIds//not kimliklerini seç
    // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState) //selecNotesData içerisindeki veriler ile işlem yapıyoruz
//selectNotesData dan gelen veriler eğer boş ise diyoruz (?? operastoru ile( Nullish coalescing operator)) initialStateyani başlangıc durumuna gider