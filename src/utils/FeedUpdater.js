import { db } from "./Firebase"
import { push, ref, set, child, get, onValue } from "firebase/database"

const dbRef = ref(db);


export const pushPost = (uid, postObject, friendsOnly) => {
  const cleanDate = (postObject.date).toJSON()
  var postReferece = ""
  if (friendsOnly === true) {
     postReferece = ref(db, `users/${uid}/posts/private/`)
  }
  else
  {
     postReferece = ref(db, `users/${uid}/posts/public/`)
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



export function getAllPosts(addFeedCard) {
  const childrenkeys = []
  const testDataRef = ref(db, 'testData/');
   onValue(testDataRef, (snapshot) => {


     snapshot.forEach((child) => {
      childrenkeys.push(child.key)
    }, 
    { onlyOnce: true });
    showAllPosts(childrenkeys, addFeedCard)
  })

}

export async function showAllPosts (childrenkeys, addFeedCard)
{
  const cards = []
  for (let index = 0; index < childrenkeys.length; index++) {
    const key = childrenkeys[index];
    await get(child(dbRef, 'testData/' + key)).then((snapshot) => {
      if (snapshot.exists()) {
        var card = snapshot.val()
        var dateRestored = new Date (card.date)
        card.date = dateRestored
        card.id = key
        console.log ("adding feedcard no. " + index + " with the author " + card.author)
        addFeedCard (card)
  
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  
}










export const testFireBaseUpload = (testObject) => {
  var cleanDate = JSON.stringify(testObject.date)
  set(ref(db, 'testdata/' + "1"), {
    author: testObject.author,
    avatar: testObject.avatar,
    date: cleanDate,
    img: testObject.img,
    alt: testObject.alt,
    content: testObject.content,
    likeCount: testObject.likeCount
  });

}



export async function testFireBaseDownload(addFeedCard) {
  
  await get(child(dbRef, 'testdata/' + "1")).then((snapshot) => {
    if (snapshot.exists()) {
      var dateRestored = JSON.parse(snapshot.val().date)
      snapshot.val().date = dateRestored
      addFeedCard(snapshot.val())

    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

}


