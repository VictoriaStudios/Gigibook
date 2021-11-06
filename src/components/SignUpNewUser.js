import { useState, useEffect } from "react"
import useStyles from "./styles"
import { Button, TextField } from "@material-ui/core"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../utils/Firebase";
import { push, ref, child, get } from "firebase/database"

export var uid = ""

const SignUpNewUser = ({ onCloseHandler }) => {
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
                    setEnteredWrong(false)
                    // Signed in 
                    console.log("Account created")
                    const user = userCredential.user;
                    // ...
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
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                uid = user.uid;
                console.log("Signed in, uid:" + uid)
                setFormVisible(false)
                checkIfUserData()
                onCloseHandler()
            } else {
                // User is signed out
                console.log("Signed out")
                setFormVisible(true)
            }
        });
    }, [])

    const dbRef = ref(db);
    async function checkIfUserData() {
        await get(child(dbRef, 'users/' + uid)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Found user data")
                return

            } else {
                console.log("User Data not found, creating data");
                createUserData("John", "Doe")
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function createUserData(firstName, lastName) {
        const pushReference = ref(db, 'users/' + uid)
        push(pushReference, ({
            firstName: firstName,
            lastName: lastName,
            friends: ''
        }))

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
                <div className={classes.loginForm} style={{ textAlign: "center", height: "10vh", marginTop: "1rem", marginBottom: "1rem" }}>
                    <Button type="submit" color="white" >
                        Sign Up
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SignUpNewUser
