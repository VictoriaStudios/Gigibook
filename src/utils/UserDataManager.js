import { db } from "./Firebase"
import { ref, set, child, get, remove } from "firebase/database"

const dbRef = ref(db)

export function addProfileImageLink(uid, url) {
    return new Promise((resolve, reject) => {
        set(ref(db, `users/${uid}/profileLink/`), {
            link: url
        })
            .then(() => {
                resolve("Profile link added")
            })
            .catch((error) => {
                reject("Addprofilelink: " + error.message)
            })
    })

}

export function getProfileImageLink(uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/profileLink/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // found profile Link
                    console.log ("Found the profile link")
                    resolve(snapshot.val().link)
                } else {
                    // no profile Link found
                    console.log("No profile Link Found")
                    reject("No profile Link Found")
                }
            }).catch((error) => {
                reject(error)
            })
    })
}

export function getUserData(uid) {
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
                searchString = searchString.toLowerCase()
                snapshot.forEach((user) => {
                    const thisUserData = user.val()
                    thisUserData.firstName = thisUserData.firstName.toLowerCase()
                    thisUserData.lastName = thisUserData.lastName.toLowerCase()
                    if (thisUserData.uid !== uid) {
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
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
            if (snapshot.exists()) {
            } else {
                addFriendEntry(friendId, uid)
                    .then(() => removeFriendRequest(uid, friendId))
                    .then(() => setFriendsAccepted(friendId, uid))
                    .then(() => resolve())
            }
        }).catch((error) => {
            reject(error)
        })
    })

}

export function addFriendEntry(friendId, uid) {
    return new Promise((resolve, reject) => {
        set(ref(db, `users/${uid}/friends/${friendId}`), {
            friends: true
        })
            .then(() => resolve())
            .catch(error => reject(error))
    })
}

export function getFriends(uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/friends`)).then((snapshot) => {
            let friendsFound = []
            if (snapshot.exists()) {
                snapshot.forEach((entry) => {
                    const pathArray = entry.ref._path.pieces_
                    friendsFound.push(pathArray[3])
                })
            }
            resolve(friendsFound)
        })
            .catch(error => reject(error))
    })
}

export function deleteFriend (uid, friendUid) {
    return new Promise ((resolve,reject) => {
        remove (ref(db, `users/${uid}/friends/${friendUid}`))
            .then (() => { 
                resolve ("Friend deleted")
            })
            .catch (error => reject (error))
    })
} 

export function addDeleteRequest (uid, friendUid) {
    return new Promise ((resolve, reject) => {
        set (ref(db, `users/${friendUid}/deleteRequests/${uid}`), {
            deleteMe: true
        })
        .then (() => resolve ())
        .catch (error => reject (error))
    })
}

export function getDeleteRequests (uid) {
    console.log ("getDeleteRequests executed")
    return new Promise ((resolve, reject) => {
        let foundRequests = []
        get (child(dbRef, `users/${uid}/deleteRequests`)). then ((snapshot) => {
            if (snapshot.exists()){
                snapshot.forEach (entry => {
                    const pathArray = entry.ref._path.pieces_
                    foundRequests.push(pathArray[3])
                })
            }
            resolve (foundRequests)
        })
        
        .catch (error => reject (error))
    })
}

export function setFriendsAccepted(friendId, uid) {
    return new Promise((resolve, reject) => {
        set(ref(db, `users/${friendId}/requestsAccepted/${uid}`), {
            accepted: true
        })
            .then(() => resolve())
            .catch(error => reject(error))
    })
}

export function getFriendsAccepted(uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/requestsAccepted/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const acceptsFound = []
                snapshot.forEach((user) => {
                    const pathArray = user.ref._path.pieces_
                    acceptsFound.push(pathArray[3])
                })
                console.log ("Getfriendsaccepted: resolved " + acceptsFound)
                resolve(acceptsFound)
            }
            else {
                resolve([])
            }
        })
            .catch(error => reject(error))
    })
}

export function removeFriendsAccepted(friendId, uid) {
    return new Promise((resolve, reject) => {
        remove(ref(db, `users/${uid}/requestsAccepted/${friendId}`))
            .then(() => {
                resolve("Removed friend accepted")
            })
            .catch((error) => {
                reject("removeFriendsAccepted: " + error.message)
            })
    })
}

export function setFriendRequest(friendId, uid) {
    return new Promise((resolve, reject) => {
        set(ref(db, `users/${friendId}/friendRequests/${uid}`), {
            request: "true"
        })
            .then(() => {
                resolve("Added friend request")
            })
            .catch((error) => {
                reject("setFriendRequest: " + error.message)
            })
    })
}

export function getFriendRequests(uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/friendRequests/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const requestsFound = []
                snapshot.forEach((user) => {
                    const pathArray = user.ref._path.pieces_
                    requestsFound.push(pathArray[3])
                })
                resolve(requestsFound)
            }
            else {
                resolve([])
            }
        })
            .catch(error => reject(error))
    })
}


export function removeFriendRequest(friendId, uid) {
    return new Promise((resolve, reject) => {
        remove(ref(db, `users/${friendId}/friendRequests/${uid}`))
            .then(() => {
                resolve("Removed friend request")
            })
            .catch((error) => {
                reject("removeFriendRequest: " + error.message)
            })
    })
}

export function checkIfFriend(friendId, uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${uid}/friends/${friendId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function checkIfFriendRequest(friendId, uid) {
    return new Promise((resolve, reject) => {
        get(child(dbRef, `users/${friendId}/friendRequests/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

