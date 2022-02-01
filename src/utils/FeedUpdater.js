import { db } from "./Firebase"
import { push, ref, child, get, set, remove } from "firebase/database"

const dbRef = ref(db);


export const pushPost = (uid, postObject, friendsOnly) => {
  const cleanDate = postObject.date.toJSON()
  var postReferece = ""
  if (friendsOnly === true) {
    postReferece = ref(db, `users/${uid}/posts/private/`)
  }
  else {
    postReferece = ref(db, `/public/posts/${uid}`)
  }

  push(postReferece, ({
    authorUid: uid,
    author: postObject.author,
    date: cleanDate,
    img: postObject.img,
    alt: postObject.alt,
    content: postObject.content,
    likeData: {
      likeCount: 0,
      likeUids: [""]
    }
  }))
}

export const changePost = (uid, postObject, cardData) => {
  const cleanDate = postObject.date.toJSON()
  set(ref(db, cardData.path), {
    authorUid: uid,
    author: postObject.author,
    date: cleanDate,
    img: postObject.img,
    alt: postObject.alt,
    content: postObject.content,
    likeData: {
      likeCount: cardData.likeData.likeCount,
      likeUids: cardData.likeData.likeUids
    }
  })
}



export function getAllPosts(uid) {
  return new Promise((resolve, reject) => {
    let publicDone = false
    let personalDone = false
    let friendsDone = false
    let postsFound = []

    function checkIfDone() {
      if (publicDone && personalDone && friendsDone) {
        console.log("FU: All posts retrieved")
        resolve(postsFound)
      }
    }

    function prepareCard(post) {
      var card = post.val()
      var dateRestored = new Date(card.date)
      card.date = dateRestored
      card.id = post.key
      const pathArray = post.ref._path.pieces_
      var path = '/'
      pathArray.forEach((element) => path += `${element}/`)
      card.path = path
      return card
    }

    //get all public posts 
    get(child(dbRef, '/public/posts/')).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          child.forEach((post) => {
            const card = prepareCard(post)
            card.public = true
            postsFound.push(card)
          })
        })
      }
      publicDone = true
      checkIfDone()

    })

    //get all personal posts
    get(child(dbRef, `/users/${uid}/posts/private/`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((post) => {
          const card = prepareCard(post)
          card.public = false
          postsFound.push(card)
        })
      }
      personalDone = true
      checkIfDone()
    }).catch((error) => {
    })


    //get all friends' posts
    //first, get all friends' uids
    const friendUids = []
    get(child(dbRef, `/users/${uid}/friends/`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          friendUids.push(child.key)
        })
      }
      else {
        friendsDone = true
        checkIfDone()
      }

    }).catch((error) => {
      console.log(error.message)
    })
      //get all posts by each friend
      .then(() => {
        friendUids.forEach((friend) => {
          get(child(dbRef, `/users/${friend}/posts/private/`)).then((snapshot) => {
            if (snapshot.exists()) {
              snapshot.forEach((post) => {
                const card = prepareCard(post)
                card.public = false
                postsFound.push(card)
              })
            }
            friendsDone = true
            checkIfDone()
          }).catch((error) => {
          })
        })
      })
  })



}

export function likePost(uid, path) {
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot => {
      let cardData = snapshot.val()
      if (cardData.likeData.likeUids === undefined) {
        reject("Undefined")
        return
      }
      cardData.likeData.likeUids.forEach((entry) => {
        if (entry === uid) {
          reject("Post already liked")
          return
        }
      })
      let newLikeUids = [...cardData.likeData.likeUids, uid]
      let newLikeCount = cardData.likeData.likeCount + 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(() => resolve("DB: Uid like entry modified"))
        .catch(error => reject(error))
    }))
  })
}

export function unLikePost(uid, path) {
  console.log("Unlikepost started")
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot) => {
      let cardData = snapshot.val()
      if (cardData.likeData.likeUids === undefined) {
        console.log("Undefined")
        return
      }
      let uidFound = false
      let uidIndex = -1
      cardData.likeData.likeUids.forEach((entry, index) => {
        if (entry === uid) {
          uidFound = true
          uidIndex = index
          console.log("Found uid, index is " + uidIndex)
        }
      })
      if (!uidFound) {
        reject("Uid not found in like data")
        return
      }
      cardData.likeData.likeUids.splice(uidIndex, 1)
      let newLikeUids = cardData.likeData.likeUids
      let newLikeCount = cardData.likeData.likeCount - 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(() => resolve("DB: Uid like entry modified"))
        .catch(error => reject(error))
    })
  })
}

export function removePost (path) {
  return new Promise ((resolve, reject) => {
    remove (ref (db, path))
      .then (() => resolve ("Post deleted"))
      .catch ((error) => reject (error))
  })
}

export function addComment (cardData, uid, userData, content) {
  return new Promise ((resolve, reject) => {
    const now = new Date(Date.now())
    push (ref(db, `${cardData.path}/comments/${uid}`), {
      authorUid: uid,
      author: userData.firstName,
      content: content,
      date:now.toJSON(),
      likeData: {
        likeCount: 0,
        likeUids: [""]
      }
    }).then (resolve ("Comment pushed"))
      .catch (error => reject (error))
  })
}

export function getAllComments (path) {
  return new Promise ((resolve, reject) => {
    var commentsArray = []
    get(child(dbRef, `${path}/comments`)).then ((entries) => {
        entries.forEach(entry => {
          entry.forEach (comment => {
            let commentPrepared = comment.val()
            var dateRestored = new Date(commentPrepared.date)
            commentPrepared.date = dateRestored
            const pathArray = comment.ref._path.pieces_
            var path = '/'
            pathArray.forEach((element) => path += `${element}/`)
            commentPrepared.path = path
            commentsArray.push (commentPrepared)
          })
        })
      resolve (commentsArray)
    })
    .catch (error => reject (error))
})
}

export function likeComment(uid, path) {
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot => {
      let commentData = snapshot.val()
      if (commentData.likeData.likeUids === undefined) {
        reject("Undefined")
        return
      }
      commentData.likeData.likeUids.forEach((entry) => {
        if (entry === uid) {
          reject("Post already liked")
          return
        }
      })
      let newLikeUids = [...commentData.likeData.likeUids, uid]
      let newLikeCount = commentData.likeData.likeCount + 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(() => resolve("DB: Uid like entry modified"))
        .catch(error => reject(error))
    }))
  })
}

export function unLikeComment(uid, path) {
  console.log("Unlikepost started")
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot) => {
      let commentData = snapshot.val()
      if (commentData.likeData.likeUids === undefined) {
        console.log("Undefined")
        return
      }
      let uidFound = false
      let uidIndex = -1
      commentData.likeData.likeUids.forEach((entry, index) => {
        if (entry === uid) {
          uidFound = true
          uidIndex = index
          console.log("Found uid, index is " + uidIndex)
        }
      })
      if (!uidFound) {
        reject("Uid not found in like data")
        return
      }
      commentData.likeData.likeUids.splice(uidIndex, 1)
      let newLikeUids = commentData.likeData.likeUids
      let newLikeCount = commentData.likeData.likeCount - 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(() => resolve("DB: Uid like entry modified"))
        .catch(error => reject(error))
    })
  })
}



