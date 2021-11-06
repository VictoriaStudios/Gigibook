import { db } from "./Firebase"
import { push, ref, set, child, get, onValue } from "firebase/database"

const dbRef = ref(db);


export const pushPost = (uid, postObject, friendsOnly) => {
  const cleanDate = (postObject.date).toJSON()
  var postReferece = ""
  if (friendsOnly === true) {
    postReferece = ref(db, `users/${uid}/posts/private/`)
  }
  else {
    postReferece = ref(db, `/public/posts/${uid}`)
  }

  push(postReferece, ({
    author: postObject.author,
    avatar: postObject.avatar,
    date: cleanDate,
    img: postObject.img,
    alt: postObject.alt,
    content: postObject.content,
    likeCount: postObject.likeCount
  })).then((snap) => {
    const key = snap.key
  })

}



export function getAllPosts(uid, addFeedCard) {

  //get all public posts 
  const publicPostsRef = get(child(dbRef, '/public/posts/')).then((snapshot) => {
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

  //get all friends' posts
  //first, get all friends' uids
  const friendUids = []
  const privatePostRef = get(child(dbRef, `/users/${uid}/friends/`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        console.log(`Found a friend: ${child.key}`)
        friendUids.push (child.key)
      })
    }

  }).catch((error) => {
  }).then (() => {
    console.log (`Found a total of ${friendUids.length}`)
    console.log ("Trying to access friends' posts")
    friendUids.forEach ((friend) => {
      console.log (`Accessing friend ${friend}`)
      const privatePostRef = get(child(dbRef, `/users/${friend}/posts/private/`)).then((snapshot) => {
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



