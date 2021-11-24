import { db } from "../utils/Firebase"
import {  ref, set, child, get } from "firebase/database"
import { Button } from "@material-ui/core"

const dbRef = ref(db)

export function addProfileImageLink (uid, url) {
    set (ref(db, `users/${uid}/profileLink/`), {
        link: url
    })
    .then (() => {
        console.log ("URL link added to database")
    })
    .catch ((error) => {
        console.log (error)
    })
}

export function getProfileImageLink (uid) {
    return new Promise ((resolve, reject) => {
        get(child(dbRef, `users/${uid}/profileLink/`)).then((snapshot) => {
            if (snapshot.exists()) {
                // found profile Link
                resolve (snapshot.val().link)
            } else {
                // no profile Link found
                reject ("No profile Link Found")
            }
        }).catch((error) => {
            console.error(error);
            reject (error)
        })
    })
}

export function getUserData (uid) {
    return new Promise ((resolve,reject) => {
        get(child(dbRef, 'users/' + uid)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve (snapshot.val())
            } else {
                reject("User Data not found, creating data");
            }
        }).catch((error) => {
            reject(error)
        });
    })
     
}

const UserDataManager = ({loggedIn, uid}) => {

    const addFriend = (friendId) => {
        get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
            if (snapshot.exists()) {
            } else {
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



