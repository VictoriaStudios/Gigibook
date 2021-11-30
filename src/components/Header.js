import { useState } from 'react';
import { AppBar, Button, Box, Modal, TextField, Toolbar, Typography } from '@material-ui/core'
import useStyles from './styles'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import Login from './Login';
import { getAuth, signOut } from '@firebase/auth';
import SignUpNewUser from './SignUpNewUser';
import UserDataManager from '../utils/UserDataManager';



const handleSubmit = (e) => {
    e.preventDefault()
    //insert Search code once I know how to handle databases
}

const auth = getAuth()

const Header = ({ homeURL, loggedIn, uid}) => {
    const [searchText, setSearchText] = useState("")
    const [loginOpen, setLoginOpen] = useState(false);
    const [newUserOpen, setNewUserOpen] = useState(false);
    const handleOpenLogin= () => setLoginOpen(true);
    const handleCloseLogin = () => setLoginOpen(false);
    const handleNewUserOpen= () => setNewUserOpen(true);
    const handleNewUserClose = () => setNewUserOpen(false);
    const classes = useStyles()


    return (
        <>
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position="static" color="primary">
                <Toolbar style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    <div style={{ display: "flex" }}>
                        <Button
                            className={classes.button}
                            href={homeURL}
                            color="inherit"
                            startIcon={<FacebookRoundedIcon className={classes.largeIcon} />}
                        />
                        <form noValidate autoComplete="off" className={classes.searchField} onSubmit={handleSubmit}>
                            <TextField onChange={(e) => setSearchText(e.target.value)}
                                id="filled-basic"
                                variant="outlined"
                                label="Search Social App"
                                color="secondary"
                            />
                        </form>
                    </div>
                    <Box style={{ justifySelf: "flex-end" }}>

                        {loggedIn === false ?
                            (<>
                            <Button onClick={handleOpenLogin}>
                                Login
                            </Button>
                            <Button onClick={handleNewUserOpen}>
                                Sing Up
                            </Button>
                            </>) : (<Button onClick={() => signOut(auth)}>
                                Logout
                            </Button>)}

                    </Box>
                    <Modal
                        open={loginOpen}
                        onClose={handleCloseLogin}
                        aria-labelledby="modal-modal-title"
                        BackdropProps={{
                            style: {
                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                            }
                        }}
                    >
                        <Box className={classes.modal}>
                            <Typography style={{marginTop:"2rem", marginBottom: "2rem", fontWeight:"bold"}} align="center" variant="h4" component="h2">
                                Login to Gigibook
                            </Typography>
                            <Login onCloseHandler={handleCloseLogin} />
                        </Box>
                    </Modal>

                    <Modal
                        open={newUserOpen}
                        onClose={handleNewUserClose}
                        aria-labelledby="modal-modal-title"
                        BackdropProps={{
                            style: {
                                backgroundColor: "rgba(0, 0, 0, 0.8)"
                            }
                        }}
                    >
                        <Box className={classes.modal}>
                            <Typography style={{marginTop:"2rem", marginBottom: "2rem", fontWeight:"bold"}} align="center" variant="h4" component="h2">
                                Sign up to Gigibook
                            </Typography>
                            <SignUpNewUser onCloseHandler={handleNewUserClose} loggedIn = {loggedIn} uid = {uid}/>
                        </Box>
                    </Modal>
                </Toolbar>
            </AppBar>
        </Box>
        </>

    )
}

export default Header
