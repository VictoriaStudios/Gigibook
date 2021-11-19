import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import { getProfileImageLink } from "./components/UserDataManager";

const homeURL = "http://localhost:3000"
const auth = getAuth()

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uid, setUid] = useState('')
  const [avatarURL, setAvatarURL] = useState('')


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("App: Logged in")
        console.log ("App: uid is " + user.uid)
        setUid(user.uid)
        setLoggedIn(true)
        console.log ("GetProfileImageLink triggered")
            getProfileImageLink(user.uid)
              .then((url) => {
                setAvatarURL (url)
              })
              .catch((error) => console.log(error))
          }
      else {
        console.log("App: Logged out")
        setLoggedIn(false)
        setAvatarURL('')
      }
    })
  }, [])


  return (
    <>
      <CssBaseline />
      <Header homeURL={homeURL} loggedIn={loggedIn} uid={uid} />
      <MainBody loggedIn={loggedIn} uid={uid} avatarURL={avatarURL}/>


    </>
  )
}

export default App;
