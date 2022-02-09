import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect, useCallback } from "react";
import { addFriendEntry, deleteFriend, getDeleteRequests, getFriends, getFriendsAccepted, getUserData, removeFriendsAccepted } from "./utils/UserDataManager";

const homeURL = "http://localhost:3000"
const auth = getAuth()


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uid, setUid] = useState('')
  const [userData, setUserData] = useState('')
  const [friends, setFriends] = useState ([])


  const updateFriends = useCallback ((uid) => {
    console.log ("Updating friends")
    updateFriendList(uid)
    getFriendsAccepted(uid).then ((acceptsFound) => {
      if (acceptsFound.length !== 0) {
        acceptsFound.forEach (acceptId => {
          addFriendEntry(acceptId, uid)
          removeFriendsAccepted(acceptId, uid).then (() => updateFriendList(uid))
        })
      }
      else {
        getDeleteRequests(uid).then((requests) => {
          requests.forEach (request => {
            deleteFriend (uid, request)
          })
          updateFriendList(uid)
        })
        .catch (error => console.log (error))
        
      }
    })
  }, []) 

  function updateFriendList (uid) {
    console.log ("Updatefriendlist called, uid:" + uid)
    getFriends(uid).then ((results) => {
      results.forEach((result, index) => {
        console.log ("App: friendResuls no. " + index + " is " + result)
      })
      setFriends(results)
    })
  }

  App.updateFriendList = updateFriendList


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
                updateFriends(user.uid)
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
  }, [updateFriends])



  return (
    <>
      <CssBaseline />
      <Header homeURL={homeURL} loggedIn={loggedIn} uid={uid} friends={friends} updateFriendList={updateFriendList}/>
      <MainBody loggedIn={loggedIn} uid={uid} userData={userData}/>


    </>
  )
}

export default App;
