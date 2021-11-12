import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


// Create a root reference
const storage = getStorage();

export async function saveImage(image, uid, callBackFunction) {
  var fileExt = image.name.split('.').pop();
  console.log(`The file extension is ${fileExt}`)
  var imageFileName = "profile." + fileExt;
  const storageRef = ref(storage, `users/${uid}/images/${imageFileName}`)
  uploadBytes(storageRef, image).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    if (callBackFunction != null && callBackFunction != undefined) {
      callBackFunction(imageFileName, uid)
    }
  })
}

export async function getImageURL(imageId, uid, callBack) {
  getDownloadURL(ref(storage, `users/${uid}/images/${imageId}`))
    .then((url) => {
      callBack(url, uid)
    })
    .catch((error) => {
      console.log(error.message)
    });
}