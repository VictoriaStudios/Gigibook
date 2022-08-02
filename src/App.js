import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import MainBody from "./components/MainBody";
import Header from "./components/Header";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import {useState, useEffect, useCallback} from "react";
import {addFriendEntry, deleteFriend, getDeleteRequests, getFriends, getFriendsAccepted, getUserData, removeFriendsAccepted} from "./utils/UserDataManager";
import {setUid, setUserData, setFriends, setLoggedIn} from './utils/userDataSlice'
import { useDispatch } from "react-redux";

const homeURL = "https://victoriastudios.github.io/Gigibook/"
const auth = getAuth()



function App() {
    const [mobile, setMobile] = useState(window.matchMedia("(max-width: 900px)").matches)
    const dispatch = useDispatch()

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
              console.log("App: Logged in")
              dispatch (setUid(user.uid))
              dispatch (setLoggedIn(true))
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
              dispatch (setLoggedIn(false))
              dispatch (setUserData(''))
          }
      })
      const mediaHandler = e => {
          setMobile(e.matches)
      }
      window.matchMedia("(max-width: 900px)").addEventListener('change', mediaHandler)

  }, [updateFriends])

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
            dispatch (setFriends(results))
        })
    }

    App.updateFriendList = updateFriendList






    return (
        <>
            <CssBaseline />
            {!mobile ? (
                <>
                    <Header homeURL={homeURL} updateFriends={updateFriends} mobile={mobile} />
                    <MainBody/>
                </>
            ) : (
                <>
                    <div style={{display: "flex", width: "100vw"}}>
                        <Header homeURL={homeURL} updateFriends={updateFriends} mobile={mobile} />
                        <MainBody />
                    </div>
                </>
            )}
        </>
    )
}

export default App;
