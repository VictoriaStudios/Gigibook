import { db } from "./Firebase"
import { push, ref, child, get } from "firebase/database"

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
    authorUid:uid,
    author: postObject.author,
    date: cleanDate,
    img: postObject.img,
    alt: postObject.alt,
    content: postObject.content,
    likeCount: postObject.likeCount
  }))
}



export function getAllPosts(uid, addFeedCard) {

  //get all public posts 
  get(child(dbRef, '/public/posts/')).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        child.forEach((post) => {
          var card = post.val()
          var dateRestored = new Date(card.date)
          card.date = dateRestored
          card.id = post.val().key
          addFeedCard(card)
        })
      })
    }
  })

  //get all personal posts
  get(child(dbRef, `/users/${uid}/posts/private/`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
      var card = child.val()
      var dateRestored = new Date(card.date)
      card.date = dateRestored
      card.id = child.val().key
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
        friendUids.push (child.key)
      })
    }

  }).catch((error) => {
    console.log (error.message)
  })
  //get all posts by each friend
  .then (() => {
    friendUids.forEach ((friend) => {
      get(child(dbRef, `/users/${friend}/posts/private/`)).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
          var card = child.val()
          var dateRestored = new Date(card.date)
          card.date = dateRestored
          card.id = child.val().key
          addFeedCard(card)
          })
        }
      }).catch((error) => {
      })
    })
  })
}



