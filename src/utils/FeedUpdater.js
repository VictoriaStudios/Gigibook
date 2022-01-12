import { db } from "./Firebase"
import { push, ref, child, get, set } from "firebase/database"

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
      likeCount:0,
      likeUids:""
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

export function likePost(uid, cardData) {
  return new Promise((resolve, reject) => {
    if (cardData.likeData.likeUids === undefined) {
      console.log ("Undefined")
      if (cardData.likeData.likeUids.includes(uid)) reject("Post already liked")
      return
    }
    let newLikeUids = ""
    if (cardData.likeData.likeUids !== undefined) {
      newLikeUids= `${cardData.likeData.likeUids},${uid}`
    }
    else{
      newLikeUids = uid
    }
    let newLikeCount = cardData.likeData.likeCount +1
    set(ref(db, `${cardData.path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
    })
    .then (resolve ("DB: Uid like entry modified"))
    .catch (error => reject (error))
  })
}

export function unLikePost(uid, cardData) {
  return new Promise((resolve, reject) => {
    if (cardData.likeData.likeUids === undefined) {
      console.log ("Undefined")
      if (cardData.likeData.likeUids.includes(uid)) reject("Post already liked")
      return
    }
    if (!cardData.likeData.likeUids.includes (uid)) reject ("Uid not found in like data")
    let newLikeUids = cardData.likeData.likeUids.replace(uid, "")
    let newLikeCount = cardData.likeData.likeCount -1
    set(ref(db, `${cardData.path}/likeData`), {
        likeUids: newLikeUids,
        likeCount: newLikeCount
    })
    .then (resolve ("DB: Uid like entry modified"))
    .catch (error => reject (error))
  })
}




