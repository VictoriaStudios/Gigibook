import { db } from "./Firebase"
import { push, ref, child, get, set } from "firebase/database"
import { cardClasses } from "@mui/material";

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
      likeUids: ""
    }
  }))





}



export function getAllPosts(uid, addFeedCard) {

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
          addFeedCard(card)
        })
      })
    }
  })

  //get all personal posts
  get(child(dbRef, `/users/${uid}/posts/private/`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((post) => {
        const card = prepareCard(post)
        addFeedCard(card)
      })
    }
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
              addFeedCard(card)
            })
          }
        }).catch((error) => {
        })
      })
    })
}

export function likePost(uid, path) {
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot => {
      let cardData = snapshot.val()
      console.log(cardData)
      if (cardData.likeData.likeUids === undefined) {
        reject("Undefined")
        return
      }
      if (cardData.likeData.likeUids.includes(uid)) {
        reject("Post already liked")
        return
      }
      let newLikeUids = `${cardData.likeData.likeUids},${uid}`
      let newLikeCount = cardData.likeData.likeCount + 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(() => {
          console.log("Now modified")
          resolve("DB: Uid like entry modified")
        })
        .catch(error => reject(error))
    }))
  })
}

export function unLikePost(uid, path) {
  console.log ("Unlikepost started")
  return new Promise((resolve, reject) => {
    get(child(dbRef, path)).then((snapshot) => {
      let cardData = snapshot.val()
      console.log (cardData)
      if (cardData.likeData.likeUids === undefined) {
        console.log("Undefined")
        return
      }
      if (!cardData.likeData.likeUids.includes(uid)) {
        reject("Uid not found in like data")
        return
      }
      console.log ("Like Uids: " + cardData.likeData.likeUids)
      let newLikeUids = cardData.likeData.likeUids.replace(uid, "")
      let newLikeCount = cardData.likeData.likeCount - 1
      set(ref(db, `${path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
      })
        .then(resolve("DB: Uid like entry modified"))
        .catch(error => reject(error))
    })
  })
}




