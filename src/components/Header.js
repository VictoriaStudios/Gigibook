import { useState, useEffect } from 'react';
import { AppBar, Button, Box, Modal, Popover, TextField, Toolbar, Typography } from '@material-ui/core'
import useStyles from './styles'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import Login from './Login';
import { getAuth, signOut } from '@firebase/auth';
import SignUpNewUser from './SignUpNewUser';
import { findFriend } from '../utils/UserDataManager';
import SearchResults from './SearchResults';






const auth = getAuth()

const Header = ({ homeURL, loggedIn }) => {
    const [searchText, setSearchText] = useState("")
    const [loginOpen, setLoginOpen] = useState(false)
    const [newUserOpen, setNewUserOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [friendRequestOpen, setFriendRequestOpen] = useState(false)
    const [anchorSearchResult, setAnchorSearchResult] = useState(null)
    const [friendSearchOpen, setFriendSearchOpen] = useState(false)
    const searchRef = document.getElementById("searchText")
    const [searchWidth, setSearchWidth] = useState("227px")
    const handleOpenLogin = () => setLoginOpen(true)
    const handleCloseLogin = () => setLoginOpen(false)
    const handleNewUserOpen = () => setNewUserOpen(true)
    const handleNewUserClose = () => setNewUserOpen(false)
    const handleFriendRequestClick = (event) => {
        setAnchorEl(event.currentTarget)
        setFriendRequestOpen(true)
    }
    const handleFriendRequestClose = () => {
        setAnchorEl(null)
        setFriendRequestOpen(false)
    }
    const handleFriendSearchOpen = () => {
        setAnchorSearchResult(searchRef)
        setFriendSearchOpen(true)
    }
    const handleFriendSearchClose = () => {
        setAnchorSearchResult(null)
        setFriendSearchOpen(false)
    }




    const classes = useStyles()
    const searchFriends = () => {
        findFriend(searchText)
            .then((usersFound) => {
                updateResultPopperWidth()
                setSearchResults(usersFound)
                handleFriendSearchOpen(searchRef.current)
            })
            .catch(error => console.log(error))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        searchFriends()
    }

    const updateResultPopperWidth = () => {
        setSearchWidth(searchRef.offsetWidth + "px")
    }

    useEffect(() => {
        window.addEventListener('resize', handleFriendSearchClose)
    },[])




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
                            {loggedIn === true ? (
                                <>
                                    <form noValidate autoComplete="off" className={classes.searchField} onSubmit={handleSubmit}>
                                        <TextField onChange={(e) => setSearchText(e.target.value)}
                                            id="searchText"
                                            variant="outlined"
                                            label="Search GigiBook"
                                            color="secondary"
                                        />
                                    </form>
                                    <Button onClick={searchFriends} style={{ maxHeight: "36.5px", alignSelf: "center" }}>Find Friends</Button>
                                </>
                            ) : ("")}

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
                                </>) : (
                                    <>
                                        <Button
                                            className={classes.button}
                                            color="inherit"
                                            startIcon={<GroupRoundedIcon className={classes.mediumIcon}
                                                onClick={handleFriendRequestClick} />}
                                        />
                                        <Button onClick={() => signOut(auth)}>
                                            Logout
                                        </Button>
                                    </>)}

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
                                <Typography style={{ marginTop: "2rem", marginBottom: "2rem", fontWeight: "bold" }} align="center" variant="h4" component="h2">
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
                                <Typography style={{ marginTop: "2rem", marginBottom: "2rem", fontWeight: "bold" }} align="center" variant="h4" component="h2">
                                    Sign up to Gigibook
                                </Typography>
                                <SignUpNewUser loggedIn={loggedIn} onCloseHandler={handleNewUserClose} />
                            </Box>
                        </Modal>
                    </Toolbar>
                </AppBar>
            </Box>
            <Popover
                open={friendRequestOpen}
                anchorEl={anchorEl}
                onClose={handleFriendRequestClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
            <Popover
                open={friendSearchOpen}
                anchorEl={anchorSearchResult}
                onClose={handleFriendSearchClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box style={{ width: searchWidth }}>
                    <div>
                        <SearchResults results={searchResults}></SearchResults>
                    </div>
                </Box>
            </Popover>
        </>

    )
}

export default Header
