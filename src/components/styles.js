import { makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    button: {
        position: "relative",
    },
    mediumIcon: {
        transform: "scale(2)",
        padding: "2px"
    },

    largeIcon: {
        transform: "scale(3)",
        padding: "2px"
    },

    searchField: {
        paddingTop: ".5rem",
        paddingBottom: ".4rem",
    },
    loginForm: {
        display: "block",
        paddingTop: ".5rem",
        paddingBottom: ".4rem",
        justifySelf: "end"
    },
    modal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "Translate(-50%, -50%)",
        backgroundColor: "rgba(255,255,255,0.8)",
        width: "500px",
    },

    postbar: {
        paddingBottom: "10px !important",
        paddingTop: "10px !important",
        margin: "0"
    },

    postbarAddPostButton: {
        paddingBottom: "0",
        paddingTop: "0",
        flexGrow: "1",
        textTransform: "none"

    },

    feedCard: {
        marginBottom: "1rem"
    },

    feedCardActionBar: {
        display: "flex",
    },

    feedCardLikeIcon: {
        color: "blue",
        marginTop: ".5rem",
        marginRight: ".5rem"
    },

    feedCardActionDesc: {
        marginLeft: "1rem"
    },

    newPostTitle: {
        backgroundColor: "white",
        paddingTop: ".5rem",
        paddingBottom: ".5rem"
    },
    popoverPaper: {
        minWidth: "0"
    },
    commentActionDesc: {
        marginLeft: ".5rem",
        fontSize: "1rem"
    },
    friendRequestBox: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
    },
    friendListBox: {
        textAlign: "center",
    },
    termsPaper: {
        width: "80vw",
        height:"80vh"
    },
    termsBody: {
        width:"95%",
        margin:"auto"
        
    },
    deadCenter: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "Translate(-50%,-50%)"
    }
}))

export default useStyles
