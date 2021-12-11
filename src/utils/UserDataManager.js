import { db } from "./Firebase"
import { ref, set, child, get, remove } from "firebase/database"

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
                    if (thisUserData.uid!== uid){
                        if (thisUserData.firstName === (searchString) || thisUserData.lastName === searchString) 
                        usersFound.push(user.val())
                    }
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
        console.error(error)
    })
}

export function addFriendEntry(friendId, uid) {
    set(ref(db, `users/${uid}/friends/${friendId}`), {
        friends: true
    })
}

export function setFriendRequest (friendId, uid) {
    return new Promise ((resolve, reject) => {
        set(ref(db, `users/${friendId}/friendRequests/${uid}`), {
            request: "true"
        })
            .then (()=> {
                resolve ("Added friend request")
            })
            .catch((error) => {
                reject ("setFriendRequest: " + error.message)
            })
    })
}

export function removeFriendRequest (friendId, uid) {
    return new Promise ((resolve, reject) => {
        remove(ref(db, `users/${friendId}/friendRequests/${uid}`))
            .then (()=> {
                console.log ("Removed friend request")
                resolve ("Added friend request")
            })
            .catch((error) => {
                reject ("removeFriendRequest: " + error.message)
            })
    })
}

export function checkIfFriend(friendId, uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log (friendId+ " is a friend already")
                resolve (true)
            } else {
                console.log (friendId+ " is not a friend yet")
                resolve (false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function checkIfFriendRequest (friendId, uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${friendId}/friendRequests/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log (friendId+ " is already being requested")
                resolve (true)
            } else {
                console.log (friendId+ " is not being requested yet")
                resolve (false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}



