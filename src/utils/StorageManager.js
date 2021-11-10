import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


// Create a root reference
const storage = getStorage();





export function saveImage(image, uid) {
  var fileExt = image.name.split('.').pop();
  console.log (`The file extension is ${fileExt}`)
  var imageFileName = "profile." + fileExt;
  const storageRef = ref(storage, `users/${uid}/images/${imageFileName}`);
  uploadBytes(storageRef, image).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}

export function getImageURL(imageId, uid, callBack) {
  getDownloadURL(ref(storage, `users/${uid}/images/${imageId}`))
    .then((url) => {
      console.log(`Returning ${url}`)
      callBack(url)
    })
    .catch((error) => {
      console.log(error.message)
    });
}