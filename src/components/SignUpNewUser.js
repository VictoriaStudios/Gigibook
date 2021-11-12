import { useState, useEffect } from "react"
import useStyles from "./styles"
import { Button, TextField } from "@material-ui/core"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../utils/Firebase";
import { set, push, ref, child, get } from "firebase/database"
import { saveImage, getImageURL } from "../utils/StorageManager";
import { addProfileImageLink, addProfileImageName } from "./UserDataManager";

const SignUpNewUser = ({ loggedIn, onCloseHandler }) => {
    const auth = getAuth();
    const classes = useStyles()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [firstName, setFirstName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [formVisible, setFormVisible] = useState(true)
    const [enteredWrong, setEnteredWrong] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [image, setImage] = useState("")

    const getProfileLink = (imageName, uid) => {
        getImageURL (imageName, uid, setProfileLink)
    }

    const setProfileLink = (url, uid) => {
        addProfileImageLink (uid, url)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        createNewUser(auth, email, password)
    }

    const makeFormVisible = (bool) => {
        setFormVisible(bool)
    }

    function createNewUser(auth, email, password) {
        console.log("Trying to create new user")
        if (password === passwordRepeat) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    var user = userCredential.user
                    setEnteredWrong(false)
                    createUserData(firstName, familyName, user.uid)
                        .then(() => {
                            saveImage(image, user.uid, getProfileLink)
                        })

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
                        setErrorMessage("Password too weak")
                    }
                });
        }
        else {
            setEnteredWrong(true)
            setErrorMessage("The passwords are not identical")
        }

    }

    useEffect(() => {
        if (loggedIn === false) {
            setFormVisible(true)
        }
        else {
            setFormVisible(false)
            onCloseHandler()
        }
    }, [loggedIn])

    const dbRef = ref(db);

    async function createUserData(firstName, lastName, userId) {
        console.log("Trying to create user DB data with ")
        const pushReference = ref(db, 'users/' + userId)
        set(pushReference, ({
            firstName: firstName,
            lastName: lastName,
            friends: ''
        })).catch((error) => {
            console.log(error)
        })

    }

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
                    <input onChange={(e) => { setImage(e.target.files[0]) }}
                        type="file"
                        hidden />
                </Button>
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
