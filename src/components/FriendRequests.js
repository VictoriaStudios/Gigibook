import { useState, useEffect, useCallback } from "react"
import { addFriend, getFriendRequests, getUserData, removeFriendRequest, setFriendRequest } from "../utils/UserDataManager"
import { Box, IconButton, Typography } from "@material-ui/core"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import useStyles from './styles'
import Friend from "./Friend"

const FriendRequests = ({ uid, friends, updateFriendList }) => {
    const [requests, setRequests] = useState([])

    const updateFriendRequests = () => {
            console.log("Handling updatefriendRequest")
             var requestIds = []
             getFriendRequests(uid)
                .then((foundRequests) => {
                    requestIds = foundRequests
                    var requestData = []
                    if (requestIds.length > 0){
                        requestIds.forEach((request, index) => {
                            console.log ("Running loop for " + request)
                            getUserData (request)
                                .then ((userData) => {
                                    requestData.push (userData)
                                    if (index === requestIds.length-1) {
                                        setRequests (requestData)
                                    }
                                })
                                .catch (error => console.log (error))
                        })
                    }
                    else{
                        setRequests ([])
                    }

                })
                .catch(error => console.log(error))
        
    }

    function handleAcceptRequest(request) {
        addFriend(request.uid, uid).then(() => {
            console.log("Friend added, updating friend list")
            updateFriendList(uid)
        })
    }

    function handleRefuseRequest(request) {
        removeFriendRequest(uid, request.uid).then(() => updateFriendRequests())
    }

    useEffect(() => {
        updateFriendRequests()
    }, [friends])

    const classes = useStyles()

    return (
        <div>
            <Box className={classes.friendRequestBox}>
                {requests.length === 0 ? (
                    <>
                        <Typography style={{ marginLeft: "5px" }} variant="caption" > No friend requests </Typography>
                    </>
                ) : (
                    requests.map((request, index) => (
                        <div key={index}>
                            <Typography style={{ marginLeft: "5px" }} variant="caption" >{request.firstName} </Typography>
                            <IconButton onClick={() => { handleAcceptRequest(request) }}><AddCircleRoundedIcon /></IconButton>
                            <IconButton onClick={() => { handleRefuseRequest(request) }}><RemoveCircleRoundedIcon /></IconButton>
                        </div>
                    ))
                )}
            </Box>
            <Box className={classes.friendListBox}>
                <Typography variant="caption" >--- Friend List ---</Typography>
                {friends.length !== 0 ? (
                    (friends.map((friend, index) => (
                        <div key={`friend ${index}`}>
                            <Friend friend={friend} uid={uid} />
                        </div>
                    )))
                ) :
                    ("")}
            </Box>
        </div>
    )
}



export default FriendRequests
