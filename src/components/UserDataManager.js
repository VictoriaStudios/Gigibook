import { db } from "../utils/Firebase"
import { push, ref, update, set, child, get } from "firebase/database"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { useEffect, useState } from 'react'
import { Button } from "@material-ui/core"


const auth = getAuth()
var uid = ''
const dbRef = ref(db)

export async function addProfileImageLink (uid, url) {
    console.log ("AddProfileLink, received uid " + uid)
    set (ref(db, `users/${uid}/profileLink/`), {
        link: url
    })
}

const UserDataManager = ({loggedIn, uid}) => {

    const addFriend = (friendId) => {
        get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log ("Friend does exist")
            } else {
                console.log("Friend does not exist");
                addFriendEntry (friendId);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    const addFriendEntry = (friendId) => {
        set (ref(db, `users/${uid}/friends/${friendId}`), {
            friends: true
        })

    }



    return (
        <>
            <Button onClick={() => addFriend("TFnzchuStoeGtnu6fdiVCQFThWw2")} >Add Friend</Button>
        </>
    )
}

export default UserDataManager



