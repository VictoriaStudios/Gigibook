import { useState, useEffect, useCallback } from "react"
import { addFriend, getFriendRequests, getUserData, removeFriendRequest } from "../utils/UserDataManager"
import { Box, IconButton, Typography } from "@material-ui/core"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import useStyles from './styles'
import Friend from "./Friend"
import { updateFriendList } from "../App"

const FriendRequests = ({uid, friends}) => {
    const [requests, setRequests] = useState([])

    const updateFriendRequests = useCallback (() => {
        setRequests([])
        var requestIds = []
        getFriendRequests(uid)
            .then ((foundRequests) => {
                requestIds=foundRequests
                var requestData = []
                requestIds.forEach((request, index) => {
                    getUserData(request)
                        .then((userData) => {
                            requestData.push (userData)
                            if (index === requestIds.length-1)
                            {
                                setRequests(requestData)
                            }
                        })
                        .catch (error => console.log (error))
                })
            })
            .catch (error => console.log (error))
    }, [uid])

    function handleAcceptRequest (request) {
        addFriend(request.uid, uid).then(() => {
            updateFriendRequests().then(() => {
                updateFriendList()
            })
        })
    }

    function handleRefuseRequest (request) {
        removeFriendRequest(uid, request.uid).then(() => updateFriendRequests())
    }

    useEffect(() => {
        updateFriendRequests()
    },[updateFriendRequests])

    const classes = useStyles()

    return (
        <div>
            <Box className={classes.friendRequestBox}>
                {requests.length===0 ? (
                    <>
                        <Typography style={{marginLeft:"5px"}} variant="caption" > No friend requests </Typography>
                    </>
                ): (
                    requests.map((request, index) => (
                        <div key={index}>
                        <Typography style={{marginLeft:"5px"}} variant="caption" >{request.firstName} </Typography>
                        <IconButton onClick={() => {handleAcceptRequest(request)}}><AddCircleRoundedIcon/></IconButton>
                        <IconButton onClick={() => {handleRefuseRequest(request)}}><RemoveCircleRoundedIcon/></IconButton>
                        </div>
                    ))
                )}
            </Box>
            <Box className={classes.friendListBox}>
            <Typography variant="caption" >--- Friend List ---</Typography>
                {friends.length !== 0 ? (
                    (friends.map ((friend, index) => (
                        <div key = {`friend ${index}`}>
                            <Friend friend={friend} uid={uid}/>
                        </div>
                    )))
                ):
                ("")}
            </Box>
        </div>
    )
}



export default FriendRequests
