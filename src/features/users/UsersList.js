
import {useGetUsersQuery} from "./usersApiSlice" // usersApiSlice sayfasında yazdığımız query i burada çağırıyoruz.
//çağırdığımız query ile gelen data yı ve işlem adımlarını kontrol ederek bazı işlemleri gerçekleştirceğiz

// user tablosunda ki  tbody kısmını başka bir compeonentte oluşturduk ve compententi çağırıyoruz
import User from "./User"
const UsersList = () => {
  const[getUsers, {
    data:users,
    isLoading,
    isSuccess,
    isError,
    error
  }]=useGetUsersQuery('usersList',{//buradaki değerleri store da bir listener oluşturduktan sonra giriyoruz
    pollingInterval:60000,
    refetchOnFocus:true,
    refetchOnMountOrArgChange:true
  })

  //useGetUsersQuery fonksiyonundan gelen bilgileri aktardık 
  //sorgunun aşama durumlarına göre sayfamızda gerek yükleniyor gerekse hata oluştuğuna dair yönergeleri göstereceğiz

  //burada bir content değişkeni açıyoruz data nın yüklenme durumlarına göre içeriğini değiştiriyoruz ve render ediyoruz
  //daha render edilmeden content içeriğini kontrol etmek ve hızlı yüklenmesi açısından bu kullanımı önerşlmektedir
  let content
  
  if(isLoading) content=<p>Loading...</p>

  if(isError){
    content = <p className="errmsg">{error?.data?.message}</p>
   console.log(error)
  }

  if(isSuccess){

    
      getUsers()
    
    const {ids}=users

    //burada component kullanarak tasarımı gelen bilgiler ile otomatik oluşturacağız
    // ilgili componenetimizi farklı tablolların tbody kısımlarımda tektar kullanmak adına başka bir js dosyası olarak oluşturacazğız
    //sonrasında kullanacağız sayfa içerisinde çağırağız ve ilgili render işleminde kullanacağız 
    //ayrı oluşturuduğumuz componentimizin içierinde diler isek fonksiyon da kullanabilir yapılacak işlemleri componenet özelinde standartlaştırabiliriz

    const tableContent = ids?.length && ids.map(userId=><User key={userId} userId={userId}/>)

    content =(
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">Username</th>
            <th scope="col" className="table__th user__roles">Roles</th>
            <th scope="col" className="table__th user__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>

      </table>
    )
  }
 return content
  }

export default UsersList