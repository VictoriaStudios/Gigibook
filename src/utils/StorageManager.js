import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v1 as v1uuid } from "uuid";

// Create a root reference
const storage = getStorage();

export function saveProfileImage(image, uid) {
  return new Promise((resolve, reject) => {
    var fileExt = image.name.split('.').pop();
    var imageFileName = "profile." + fileExt;
    const storageRef = ref(storage, `users/${uid}/images/${imageFileName}`)
    uploadBytes(storageRef, image)
      .then(() => {
        resolve(storageRef)
      })
      .catch((error) => {
        reject("saveImage failed, error: " + error)
      })
  })
}

export function saveImage(image, uid) {
  return new Promise((resolve, reject) => {
    const imageUid = v1uuid()
    const storageRef = ref(storage, `users/${uid}/images/${imageUid}/${image.name}`)
    uploadBytes(storageRef, image)
      .then(() => {
        resolve(storageRef)
      })
      .catch((error) => {
        reject("saveImage failed, error: " + error)
      })
  })

}

export function getImageURL(imageRef) {
  return new Promise((resolve, reject) => {
    getDownloadURL(imageRef)
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error.mesage)
      });
  })
}
