import { useState, useEffect } from "react"
import useStyles from "./styles"
import { Button, TextField } from "@material-ui/core"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../utils/Firebase";
import { set, ref, child, get } from "firebase/database"

var uid = ""

const Login = ({onCloseHandler}) => {
    const auth = getAuth();
    const classes = useStyles()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [formVisible, setFormVisible] = useState(true)
    const [enteredWrong, setEnteredWrong] = useState(false)

    



    const handleSubmit = (e) => {
        e.preventDefault()
        signIn(auth, email, password)
    }

    

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                uid = user.uid;
                console.log("Signed in, uid:" + uid)
                setFormVisible(false)
                checkIfUserData()
                onCloseHandler()
            } else {
                console.log("Signed out")
                setFormVisible(true)
            }
        });
    }, [])


    function signIn(auth, email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setEnteredWrong(false)
            })
            .catch((error) => {
                setEnteredWrong(true)
            });
    }

    function logOut() {
        console.log("Trying to log out")
        signOut(auth)
        setEmail("")
        setPassword("")
    }


    const dbRef = ref(db);
    async function checkIfUserData() {
        get(child(dbRef, 'users/' + uid)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Found user data")
                return

            } else {
                console.log("User Data not found, creating data");
                createUserData("Marcel", "Bruna")
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    function createUserData(firstName, lastName) {
        set(ref(db, 'users/' + uid), {
            firstName: firstName,
            lastName: email,
          });
    }






    return (
        <div style={{ display: "flex" ,justifyContent: "center", alignItems: "center" }}>
            {formVisible ? (

                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField className={classes.loginForm} required onChange={(e) => setEmail(e.target.value)}
                        id="filled-basic"
                        variant="outlined"
                        label="email"
                        color="primary"
                    />
                    <div/>
                   
                    <TextField className={classes.loginForm} required type="password" onChange={(e) => setPassword(e.target.value)}
                        id="filled-basic"
                        variant="outlined"
                        label="password"
                        color="primary"
                    />
                    <div/>
                    {enteredWrong ? (<h6 style={{ color: "red" }}>Entered wrong password or email</h6>) : ""}
                    <div className={classes.loginForm} style={{textAlign:"center", height:"10vh"}}> 
                    <Button type="submit" color="primary" >
                        Log in
                    </Button>
                    
                    </div>
                   
                    
                </form>


            ) :
                <Button type="button" color="primary" onClick={logOut}>
                    Log Out
                </Button>}

        </div>



    )
}

export default Login
