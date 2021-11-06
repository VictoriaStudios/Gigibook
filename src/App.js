import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";

const homeURL = "http://localhost:3000"
const auth = getAuth()

function App() {
  const [loggedIn, setLoggedIn] = useState (false)
  const [uid, setUid] = useState ('')

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log ("App: Logged in")
            setLoggedIn(true)
            setUid (user.uid)
        }
        else {
          console.log ("App: Logged out")
            setLoggedIn(false)
        }
    })
}, [])


  return (
    <>
    <CssBaseline/>
    <Header homeURL={homeURL} loggedIn = {loggedIn} uid = {uid}/>
    <MainBody loggedIn = {loggedIn} uid = {uid}/>


    </>
  )
}

export default App;
