import { makeStyles } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    button: {
        position: "relative",
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
        display:"block",
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
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-around"

    },

    postbar:{
        paddingBottom: "10px !important", 
        paddingTop: "10px !important", 
        margin: "0" 
    },

    postbarAddPostButton:{
        paddingBottom: "0", 
        paddingTop: "0", 
        flexGrow:"1", 
        textTransform:"none"

    },

    feedCard:{
        marginBottom: "1rem"
    },

    feedCardActionBar:{
    display: "flex",
    },

    feedCardLikeIcon:{
        color: "blue",
        marginTop: ".5rem",
        marginRight:".5rem"
    },

    feedCardActionDesc:{
        marginLeft:"1rem"
    },

    newPostTitle:{
        backgroundColor:"white",
        paddingTop:".5rem",
        paddingBottom:".5rem"
    }
}))

export default useStyles
