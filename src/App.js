import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect, useCallback } from "react";
import { addFriendEntry, deleteFriend, getDeleteRequests, getFriends, getFriendsAccepted, getUserData, removeFriendsAccepted } from "./utils/UserDataManager";

const homeURL = "https://victoriastudios.github.io/Gigibook/"
const auth = getAuth()


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uid, setUid] = useState('')
  const [userData, setUserData] = useState('')
  const [friends, setFriends] = useState([])
  const [mobile, setMobile] = useState(window.matchMedia("(max-width: 900px)").matches)



  const updateFriends = useCallback((uid) => {
    updateFriendList(uid)
    getFriendsAccepted(uid).then((acceptsFound) => {
      if (acceptsFound.length !== 0) {
        acceptsFound.forEach(acceptId => {
          addFriendEntry(acceptId, uid)
          removeFriendsAccepted(acceptId, uid).then(() => updateFriendList(uid))
        })
      }
      else {
        getDeleteRequests(uid).then((requests) => {
          requests.forEach(request => {
            deleteFriend(uid, request)
          })
          updateFriendList(uid)
        })
          .catch(error => console.log(error))

      }
    })
  }, [])

  function updateFriendList(uid) {
    getFriends(uid).then((results) => {
      setFriends(results)
    })
  }

  App.updateFriendList = updateFriendList


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("App: Logged in")
        setUid(user.uid)
        setLoggedIn(true)
        getUserData(user.uid)
          .then((data) => {
            setUserData(data)
            updateFriends(user.uid)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      else {
        console.log("App: Logged out")
        setLoggedIn(false)
        setUserData('')
      }
    })
    const mediaHandler = e => {
      setMobile(e.matches)
    }
    window.matchMedia("(max-width: 900px)").addEventListener('change', mediaHandler)

  }, [updateFriends])



  return (
    <>
      <CssBaseline />
      {!mobile ? (
        <>
          <Header homeURL={homeURL} loggedIn={loggedIn} uid={uid} friends={friends} updateFriends={updateFriends} mobile={mobile} />
          <MainBody loggedIn={loggedIn} uid={uid} userData={userData} />
        </>
      ) : (
        <>
          <div style={{ display: "flex", width:"100vw" }}>
            <Header homeURL={homeURL} loggedIn={loggedIn} uid={uid} friends={friends} updateFriends={updateFriends} mobile={mobile} />
            <MainBody loggedIn={loggedIn} uid={uid} userData={userData} />
          </div>
        </>
      )}
    </>
  )
}

export default App;
