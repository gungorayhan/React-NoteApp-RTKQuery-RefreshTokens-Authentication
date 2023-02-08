// import { useState, useEffect } from "react"

// const usePersist = () => {
//     const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

//     useEffect(() => {
//         localStorage.setItem("persist", JSON.stringify(persist))
//     }, [persist])  //çağıralan sayfada persşst değiştiğinde buradaki useEffect içerinde kodlar çalışacak

//     return [persist, setPersist]  //persist burada köşeli paretens iiçerisinde return ediliyor çağrılırken const [persist] = usePersist bir hook mantığıyla çağrlacak

  

// }
// export default usePersist

import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist