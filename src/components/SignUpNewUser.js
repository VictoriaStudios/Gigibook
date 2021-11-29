import { useState, useEffect } from "react"
import useStyles from "./styles"
import { Button, TextField } from "@material-ui/core"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "../utils/Firebase";
import { set, ref } from "firebase/database"
import { saveProfileImage, getImageURL } from "../utils/StorageManager";
import { addProfileImageLink } from "./UserDataManager";

const SignUpNewUser = ({ loggedIn, onCloseHandler }) => {
    const auth = getAuth();
    const classes = useStyles()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [firstName, setFirstName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [enteredWrong, setEnteredWrong] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [wrongFile, setWrongFile] = useState(false)
    const [uploadErrorMessage, setUploadErrorMessage] = useState("")
    const [image, setImage] = useState("")



    const handleSubmit = (e) => {
        e.preventDefault()
        createNewUser()
    }


    function createNewUser() {
        console.log("Trying to create new user")
        if (password === passwordRepeat) {
            if (image !== "") {
                checkImage()
                    .then((result) => {
                        // if the user selected a valid image, continue with the signup process
                        createNewProfile()
                    })
                    .catch((error) => {
                        //if not, reset the file and prompt the user to upload a different file
                        setUploadErrorMessage(error)
                        setWrongFile(true)
                        setImage("")
                    })

            }
            else {
                //if no file was selected, continue with the signup process
                createNewProfile()
            }


        }
        else {
            setEnteredWrong(true)
            setErrorMessage("The passwords are not identical")
        }

    }


    function createNewProfile() {
        //create firebase auth entry
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                var user = userCredential.user
                setEnteredWrong(false)

                //create realtime database entry
                createUserData(firstName, familyName, user.uid)
                    .then((value) => {
                        console.log(value)
                        if (wrongFile === false && image !== "") {

                            //upload image if the user selected a valid one
                            saveProfileImage(image, user.uid)
                                .then((imageRef) => {

                                    //get the image URL from firebase storage
                                    getImageURL(imageRef)
                                        .then((url) => {

                                            //add the profile image url to the database
                                            addProfileImageLink(user.uid, url)
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                        })
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                        //if there is no image, create a placeholder consisting of the first letters of the name
                        else {
                            const letters = firstName[0] + familyName[0]
                            addProfileImageLink(user.uid, letters)
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    })
                    .catch((error) => console.log(error))

            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode)
                if (errorCode === "auth/email-already-in-use") {
                    setEnteredWrong(true)
                    setErrorMessage("Email is already in use")
                }

                if (errorCode === "auth/weak-password") {
                    setEnteredWrong(true)
                    setErrorMessage("Password is too weak")
                }
            });
    }

    //this creates the users base data in the realtime db
    function createUserData(firstName, lastName, userId) {
        console.log("Trying to create user DB data with createUserData")
        return new Promise((resolve, reject) => {
            const pushReference = ref(db, 'users/' + userId)
            set(pushReference, ({
                firstName: firstName,
                lastName: lastName,
                friends: '',
            })).then(() => { resolve("Data created") })
                .catch((error) => {
                    reject("Rejected " + error.message)
                })
        })


    }

    function checkImage() {
        return new Promise((resolve, reject) => {
            if (!image.type.match('image.*')) {
                console.log("Not an image!")
                reject("File is not an image")
            }
            var img = new Image()
            img.src = window.URL.createObjectURL(image)
            img.onload = function () {
                const width = img.naturalWidth
                const height = img.naturalHeight
                if (width <= 128 && height <= 128) {
                    resolve(true)
                }
                else {
                    reject("Image is larger than 128x128px")
                }
            }
            window.URL.revokeObjectURL(img.src)
        })

    }

    useEffect(() => {
        if (loggedIn === false) {
        }
        else {
            onCloseHandler()
        }
    }, [loggedIn])

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <TextField className={classes.loginForm} required onChange={(e) => setEmail(e.target.value)}
                    id="filled-basic"
                    variant="outlined"
                    label="email"
                    color="primary"
                />
                <div />

                <TextField className={classes.loginForm} required type="password" onChange={(e) => setPassword(e.target.value)}
                    id="filled-basic"
                    variant="outlined"
                    label="password"
                    color="primary"
                />
                <TextField className={classes.loginForm} required type="password" onChange={(e) => setPasswordRepeat(e.target.value)}
                    id="filled-basic"
                    variant="outlined"
                    label="repeat password"
                    color="primary"
                />
                <TextField className={classes.loginForm} required onChange={(e) => setFirstName(e.target.value)}
                    id="filled-basic"
                    variant="outlined"
                    label="first name"
                    color="primary"
                />
                <TextField className={classes.loginForm} required onChange={(e) => setFamilyName(e.target.value)}
                    id="filled-basic"
                    variant="outlined"
                    label="family name"
                    color="primary"
                />
                <div />
                {enteredWrong ? (<h6 style={{ color: "red", textAlign: "center" }}> {errorMessage} </h6>) : ""}

                <Button variant="contained" component="label">
                    Select File
                    <input onChange={(e) => { setImage(e.target.files[0], setUploadErrorMessage(""), setWrongFile(false)) }}
                        type="file"
                        hidden />
                </Button>
                {image !== "" ? (<h6> {image.name} </h6>) : ("")}
                {wrongFile ? (<h6 style={{ color: "red", textAlign: "center" }}> {uploadErrorMessage} </h6>) : ""}
                <div className={classes.loginForm} style={{ textAlign: "center", height: "10vh", marginTop: "1rem", marginBottom: "1rem" }}>
                    <Button type="submit" color="default" >
                        Sign Up
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SignUpNewUser
