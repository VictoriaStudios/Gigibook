import { db } from "./Firebase"
import { ref, set, child, get } from "firebase/database"

const dbRef = ref(db)

export function addProfileImageLink(uid, url) {
    return new Promise ((resolve, reject) => {
        set(ref(db, `users/${uid}/profileLink/`), {
            link: url
        })
            .then (()=> {
                resolve ("Profile link added")
            })
            .catch((error) => {
                reject ("Addprofilelink: " + error.message)
            })
    })

}

export function getProfileImageLink(uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/profileLink/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // found profile Link
                    resolve(snapshot.val().link)
                } else {
                    // no profile Link found
                    reject("No profile Link Found")
                }
            }).catch((error) => {
                console.error(error);
                reject(error)
            })
    })
}

export function getUserData(uid) {
    console.log("Getting user data")
    return new Promise((resolve, reject) => {
        get(child(dbRef, 'users/' + uid)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val())
            } else {
                reject("User Data not found");
            }
        }).catch((error) => {
            reject(error)
        });
    })

}


export function findFriend(searchString, uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, '/users/')).then((snapshot) => {
            if (snapshot.exists()) {
                const usersFound = []
                searchString=searchString.toLowerCase()
                snapshot.forEach((user) => {
                    const thisUserData = user.val()
                    thisUserData.firstName = thisUserData.firstName.toLowerCase()
                    thisUserData.lastName = thisUserData.lastName.toLowerCase()
                    if (thisUserData.firstName === (searchString) || thisUserData.lastName === searchString) 
                    usersFound.push(user.val())
                })
                resolve(usersFound)
            }
            else {
                reject("No userdata found")
            }
        })
            .catch(error => reject(error))
    })
}

export function addFriend(friendId, uid) {
    get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
        if (snapshot.exists()) {
        } else {
            addFriendEntry(friendId);
        }
    }).catch((error) => {
        console.error(error);
    })
}

export function addFriendEntry(friendId, uid) {
    set(ref(db, `users/${uid}/friends/${friendId}`), {
        friends: true
    })

}

