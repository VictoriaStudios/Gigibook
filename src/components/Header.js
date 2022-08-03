import { useState, useEffect } from 'react';
import { AppBar, Button, Box, Drawer, Modal, Popover, TextField, Toolbar, Typography } from '@material-ui/core'
import useStyles from './styles'
import svgLogo from "../images/logo.svg"
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import Login from './Login';
import { getAuth, signOut } from '@firebase/auth';
import SignUpNewUser from './SignUpNewUser';
import { findFriend } from '../utils/UserDataManager';
import SearchResults from './SearchResults';
import FriendRequests from './FriendRequests';
import Terms from './Terms';
import Privacy from './Privacy'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {useSelector} from 'react-redux';

const auth = getAuth()

const Header = ({ homeURL, updateFriends, mobile }) => {
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
    const [anchorTerms, setAnchorTerms] = useState(null)
    const [termsOpen, setTermsOpen] = useState(false)
    const [anchorPrivacy, setAnchorPrivacy] = useState(null)
    const [privacyOpen, setPrivacyOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const termsRef = document.getElementById("termsRef")
    const privavyRef = document.getElementById("privacyRef")
    const loggedIn = useSelector ((state) => state.userData.loggedIn)
    const uid = useSelector ((state) => state.userData.uid)

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

    const handleTermsClick = () => {
        if (termsOpen) handleTermsClose()
        else handleTermsOpen()
    }

    const handleTermsOpen = () => {
        setAnchorTerms(termsRef)
        setTermsOpen(true)
    }

    const handleTermsClose = () => {
        console.log("Closing terms")
        setAnchorTerms(null)
        setTermsOpen(false)
    }

    const handlePrivacyClick = () => {
        if (termsOpen) handlePrivacyClose()
        else handlePrivacyOpen()
    }

    const handlePrivacyOpen = () => {
        setAnchorPrivacy(privavyRef)
        setPrivacyOpen(true)
    }

    const handlePrivacyClose = () => {
        setAnchorPrivacy(null)
        setPrivacyOpen(false)
    }

    function findTopLeft(element) {
        var ele = document.getElementById(element)
        if (ele) {
            var rec = ele.getBoundingClientRect()
            console.log("Available")
            return { top: rec.top + window.scrollY, left: rec.left + window.scrollX };
        }
    }



    const classes = useStyles()
    const searchFriends = () => {
        findFriend(searchText, uid)
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

    const handleLogOff = (e) => {
        console.log("Signing off")
        signOut(auth)
    }

    const updateResultPopperWidth = () => {
        setSearchWidth(searchRef.offsetWidth + "px")
    }

    const handleMoreClick = () => {
        setDrawerOpen(!drawerOpen)
    }


    useEffect(() => {
        window.addEventListener('resize', handleFriendSearchClose)
        findTopLeft("#friendListIcon")
    }, [])




    return (
        <>
            {!mobile ? (
                <Box sx={{ flexGrow: 1, width: "100%" }} >
                    <AppBar position="static" color="primary">
                        <Toolbar style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                            <div style={{ display: "flex" }}>
                                <Button
                                    style={{ borderRadius: "50%" }}
                                    className={classes.button}
                                    href={homeURL}
                                    color="inherit"
                                >
                                    <img className={classes.mediumIcon} src={svgLogo} alt="Gigibook Logo" width="24" height="24" />
                                </Button>
                                {loggedIn === true ? (
                                    <>
                                        <form noValidate autoComplete="off" className={classes.searchField} onSubmit={handleSubmit}>
                                            <TextField onChange={(e) => setSearchText(e.target.value)}
                                                id="searchText"
                                                variant="outlined"
                                                label="Search Friends"
                                                color="secondary"
                                            />
                                        </form>
                                        <Button onClick={searchFriends} style={{ maxHeight: "36.5px", alignSelf: "center" }}>Find Friends</Button>
                                    </>
                                ) : ("")}
                                <Button onClick={handleTermsClick} style={{ maxHeight: "36.5px", alignSelf: "center" }}>
                                    Terms
                                </Button>
                                <Button onClick={handlePrivacyClick} style={{ maxHeight: "36.5px", alignSelf: "center" }}>
                                    Privacy
                                </Button>

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
                                                id="friendListIcon"
                                                className={classes.button}
                                                color="inherit"
                                                startIcon={<GroupRoundedIcon className={classes.mediumIcon}
                                                    onClick={handleFriendRequestClick} />}
                                            />
                                            <Button onClick={handleLogOff}>
                                                Logout
                                            </Button>
                                        </>)}

                            </Box>

                        </Toolbar>
                    </AppBar>
                </Box>
            ) : (
                <>
                    {loggedIn ? (
                        <AppBar position="static" color="primary" style={{ width: "42px", flex: "1" }}>
                            <Toolbar style={{ flexDirection: "column", justifyContent: "center" }}>
                                <Button
                                    style={{ borderRadius: "50%", marginBottom: "1rem", marginTop: "1rem" }}
                                    href={homeURL}
                                    color="inherit"
                                >
                                    <img className={classes.mediumIcon} src={svgLogo} alt="Gigibook Logo" width="24" height="24" />
                                </Button>
                                <Button
                                    style={{ borderRadius: "50%", marginBottom: "1rem", color: "white" }}
                                >
                                    <MoreHorizRoundedIcon onClick={handleMoreClick} />
                                </Button>
                            </Toolbar>
                        </AppBar>
                    ) : (<AppBar position="static" color="primary" style={{ width: "42px", height: "100vh" }}>
                        <Toolbar style={{ flexDirection: "column", justifyContent: "center" }}>
                            <Button
                                style={{ borderRadius: "50%", marginBottom: "1rem", marginTop: "1rem" }}
                                href={homeURL}
                                color="inherit"
                            >
                                <img className={classes.mediumIcon} src={svgLogo} alt="Gigibook Logo" width="24" height="24" />
                            </Button>
                            <Button
                                style={{ borderRadius: "50%", marginBottom: "1rem", color: "white" }}
                            >
                                <MoreHorizRoundedIcon onClick={handleMoreClick} />
                            </Button>
                        </Toolbar>
                    </AppBar>)}


                    <Drawer
                        open={drawerOpen}
                        anchor="left"
                        onClose={() => setDrawerOpen(false)}
                    >
                        <AppBar position="static" color="primary" style={{ height: "100%" }} >
                            <Toolbar style={{ flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "column", height: "70vh", justifyContent: "space-evenly" }}>
                                    <Button
                                        style={{ borderRadius: "50%" }}
                                        className={classes.button}
                                        href={homeURL}
                                        color="inherit"
                                    >
                                        <img className={classes.mediumIcon} src={svgLogo} alt="Gigibook Logo" width="24" height="24" />
                                    </Button>
                                    {loggedIn === true ? (
                                        <>
                                            <form noValidate autoComplete="off" className={classes.searchField} onSubmit={handleSubmit}>
                                                <TextField onChange={(e) => setSearchText(e.target.value)}
                                                    id="searchText"
                                                    variant="outlined"
                                                    label="Search Friends"
                                                    color="secondary"
                                                />
                                            </form>
                                            <Button onClick={searchFriends} style={{ maxHeight: "36.5px", alignSelf: "center" }}>Find Friends</Button>
                                        </>
                                    ) : ("")}
                                    <Button onClick={handleTermsClick} style={{ maxHeight: "36.5px", alignSelf: "center" }}>
                                        Terms
                                    </Button>
                                    <Button onClick={handlePrivacyClick} style={{ maxHeight: "36.5px", alignSelf: "center" }}>
                                        Privacy
                                    </Button>

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
                                                    id="friendListIcon"
                                                    className={classes.button}
                                                    color="inherit"
                                                    startIcon={<GroupRoundedIcon className={classes.mediumIcon}
                                                        onClick={handleFriendRequestClick} />}
                                                />
                                                <Button onClick={handleLogOff}>
                                                    Logout
                                                </Button>
                                            </>)}

                                </Box>
                            </Toolbar>
                        </AppBar>
                    </Drawer>
                </>
            )}

            <Modal
                open={loginOpen}
                onClose={handleCloseLogin}
                aria-labelledby="modal-modal-title"
                BackdropProps={{
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)"
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
                        backgroundColor: "rgba(0, 0, 0, 0.9)"
                    }
                }}
            >
                <Box className={classes.modal}>
                    <Typography style={{ marginTop: "2rem", marginBottom: "2rem", fontWeight: "bold" }} align="center" variant="h4" component="h2">
                        Sign up to Gigibook
                    </Typography>
                    <SignUpNewUser loggedIn={loggedIn} onCloseHandler={handleNewUserClose} openTerms={handleTermsOpen} openPrivacy={handlePrivacyOpen} />
                </Box>
            </Modal>
            <Popover
                open={friendRequestOpen}
                anchorEl={anchorEl}
                onClose={handleFriendRequestClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <FriendRequests updateFriends={updateFriends} />
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
                        <SearchResults results={searchResults} > </SearchResults>
                    </div>
                </Box>
            </Popover>
            <Popover
                open={termsOpen}
                anchorEl={anchorTerms}
                onClose={handleTermsClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <Box>
                    <Terms closeTerms={handleTermsClose} openPrivacy={handlePrivacyOpen} />
                </Box>
            </Popover>
            <Popover
                open={privacyOpen}
                anchorEl={anchorPrivacy}
                onClose={handlePrivacyClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <Box>
                    <Privacy closePrivacy={handlePrivacyClose} />
                </Box>
            </Popover>
            <div className={classes.deadCenter} id="termsRef" />
            <div className={classes.deadCenter} id="privacyRef" />
        </>

    )
}

export default Header
