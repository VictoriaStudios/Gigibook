import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


// Create a root reference
const storage = getStorage();





export function saveImage (image, uid) {
    const storageRef = ref(storage, `users/${uid}/images/${image.name}`);
    uploadBytes(storageRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
}

export function getImageURL (imageId, uid, callBack) {
  getDownloadURL(ref(storage, `users/${uid}/images/${imageId}`))
  .then((url) => {
    console.log ("returning url")
    callBack (url)
  })
  .catch((error) => {
    console.log (error.message)
  });
}