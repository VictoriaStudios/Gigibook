import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import { getUserData } from "./utils/UserDataManager";
import { update } from "@firebase/database";

const homeURL = "http://localhost:3000"
const auth = getAuth()


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uid, setUid] = useState('')
  const [userData, setUserData] = useState('')


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("App: Logged in")
        console.log ("App: uid is " + user.uid)
        setUid(user.uid)
        setLoggedIn(true)
            getUserData (user.uid)
              .then((data) => {
                setUserData(data)
              })
              .catch((error) => {
                console.log (error)
              })
          }
      else {
        console.log("App: Logged out")
        setLoggedIn(false)
        setUserData('')
      }
    })
  }, [])



  return (
    <>
      <CssBaseline />
      <Header homeURL={homeURL} loggedIn={loggedIn}/>
      <MainBody loggedIn={loggedIn} uid={uid} userData={userData}/>


    </>
  )
}

export default App;
