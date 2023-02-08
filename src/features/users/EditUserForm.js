import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EditUserForm = ({user}) => {

    //öncelikle apiSlice da oluşturduğumuz fonksiyon ve durumlar sayfaya çağırılır
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()
//form içerinde ve apiSlice da yazdığımız fonksiyonda kullanışşmak üzere değişknelerimizi oluştururuz
//buradaki değişkneleri useState ile default değerlerini atarız
//burada unutlmaması gereken userId değişkenlik göstermeyceeğinden değişken oluşturuladı
// gelen user bilgiinden user.id diyerek verimizi fonksiyonumuza göndereceğiz
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

 //username ve password gibi değerleri değişkene atamadan önce kontrolden geçirmek gerekecetir
 //form içerinden username ve password değerleri her değiştiğinde doğru bir girdi var mı kontrol edilecek
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    //ve form gönderildiğini düşündüğümüzde var sayılan değere dönmelidir

    useEffect(()=>{
        console.log(isSuccess)
        if(isSuccess || isDelSuccess){
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    },[isSuccess,isDelSuccess,navigate])

    //şimdi form içerinde value değerleri set etmek amaçıylaa fonksiyonlarımızı yazacağız
    //burada yazılan fonksiyonlar form içerinde onChange içerinde kullanılacak

    const onUsernameChanged=e=>setUsername(e.target.value)
    const onPasswordChanged=e=>setPassword(e.target.valeu)

    const onRolesChanged =(e)=>{
        const values =Array.from(
            e.target.selectedOptions,//seçielen değerler tekil olarak gelir
            (option)=>option.value// gelen tekil değerler callback fonksiyonu ile tek tek yakalanarak values içerisine aktarılır
        )
        setRoles(values) // tüm derler values den set edilir
    }

    const onActiveChanged=()=>setActive(prev=>!prev)

    //buraya kadar kullanacağımız fonksitonları ve değerlerini oluşturuduk
    //deişkenlerimizi default değerlerini belirledik ve set etmek amacıyla fonksyonlarını belitledik
    //kullancının formu kullanarak oluşturacağı değişkenlerimize gelen verinin doğruluğu kontol edildi ve set edildi
    //tüm değişkenlerin doğru yapılandırıldığından emin olduk
    //şimdi değişkenlerimizi kullanarak formu submit edeceğiz 
    const onSaveUserClicked=async()=>{
        if(password){
            await updateUser({id:user.id,username,password,roles,active})
        }else{
            await updateUser({id:user.id,username,roles,active})
        }
    }

    // burada kullanıcıyı silme işlemini gerçekleştiriyoruz
    const onDeleteUserClicked=async()=>{
        await deleteUser({id:user.id})
    }

    //sayfa içerinde yapılandırma işlemlerini uyguluyoruz
    //kullancının seçmesi adına select seçeneklerini oluşturduk
    const options=Object.values(ROLES).map(role=>{
        return(
            <option
            key={role}
            value={role}
            >
                {role}
            </option>
        )
    })

    //kaydet butonunun aktiv pasif durumunu belirliyoruz
    let canSave
    if (password) {
        canSave = [roles.length, validUsername, !validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    //oluşacak durumlara karşı kullanıcıya uyarı vermek adına classların alacağı değerleri yazıyoruz
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
 
}

export default EditUserForm