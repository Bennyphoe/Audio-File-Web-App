import { useEffect, useState } from "react"


export const retrieveUserDetails = () => {
  const [userDetails, setUserDetails] = useState()
  const sessionKey = localStorage.getItem("sessionKey")
  const id = localStorage.getItem("userId")
  
  useEffect(() => {
    const fetchDetails = async(sessionKey) => {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${sessionKey}`},
        method: "GET",
      }).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Network response was not ok");
        }
      }).then(result => {
        setUserDetails(result)
      }).catch(err => {
        console.error(err)
      })
    }
    
    if (sessionKey) {
      fetchDetails(sessionKey)
    }
  }, [sessionKey])

  return userDetails
}