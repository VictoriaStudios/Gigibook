import { db } from "../utils/Firebase"
import { push, ref, update, set, child, get } from "firebase/database"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { useEffect, useState } from 'react'
import { Button } from "@material-ui/core"
import { saveImage, getImageURL } from "../utils/StorageManager"


const auth = getAuth()
var uid = ''
const dbRef = ref(db)

const UserDataManager = ({loggedIn, uid}) => {

    const [image, setImage] = useState ("")
    const [url, setURL] = useState ("")

    const uploadImage = () => {
        if (image === "")
        {
            console.log ("No file selected")
        }
        else
        {
            saveImage (image, uid)
        }
    }

    

    function getImageLink (imageId, uid, callBack) {
        getImageURL (imageId, uid, callBack)
        
    } 



    const addFriend = (friendId) => {
        var friends = ''
        var userData = ''
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
        console.log (`Trying to add ${friendId} to database`)
        set (ref(db, `users/${uid}/friends/${friendId}`), {
            friends: true
        })

    }

    return (
        <>
            <Button onClick={() => addFriend("TFnzchuStoeGtnu6fdiVCQFThWw2")} >Add Friend</Button>
            <Button variant="contained" component="label">
                Select File
                <input onChange={(e)=>{setImage(e.target.files[0])}}
                    type="file"
                    hidden/>
            </Button>
            <Button onClick = {() => uploadImage()}> Upload Image </Button>
            <Button onClick = {() =>  getImageLink("1.jpg", uid, setURL)}> Get Image URL </Button>
        </>
    )
}

export default UserDataManager



