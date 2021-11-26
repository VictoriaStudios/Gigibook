import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Create a root reference
const storage = getStorage();

export function saveProfileImage(image, uid) {
  return new Promise((resolve, reject) => {
    var fileExt = image.name.split('.').pop();
    var imageFileName = "profile." + fileExt;
    const storageRef = ref(storage, `users/${uid}/images/${imageFileName}`)
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        resolve(imageFileName)
      })
      .catch((error) => {
        reject("saveImage failed, error: " + error)
      })
  })
}

export function saveImage(image, uid) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `users/${uid}/images/${image.name}`)
    uploadBytes(storageRef, image)
      .then(() => {
        resolve(image.name)
      })
      .catch((error) => {
        reject("saveImage failed, error: " + error)
      })
  })

}

export function getImageURL(filename, uid) {
  return new Promise((resolve, reject) => {
    getDownloadURL(ref(storage, `users/${uid}/images/${filename}`))
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error.mesage)
      });
  })
}
