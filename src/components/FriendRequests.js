import { useState, useEffect } from "react"
import { addFriend, getFriendRequests, getUserData } from "../utils/UserDataManager"
import { Box, IconButton, Typography } from "@material-ui/core"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'

const FriendRequests = ({uid}) => {
    const [requests, setRequests] = useState([])

    function updateFriendRequests () {
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
    }

    function handleAcceptRequest (request) {
        console.log ("handling Accept request")
        addFriend (request.uid, uid). then (updateFriendRequests())
    }

    useEffect(() => {
        updateFriendRequests()
    }, [])

    return (
        <div>
            <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}>
                {requests.length===0 ? (
                    <>
                        <Typography style={{marginLeft:"5px"}} variant="caption" > No friend requests </Typography>
                    </>
                ): (
                    requests.map((request, index) => (
                        <div key={index}>
                        <Typography style={{marginLeft:"5px"}} variant="caption" >{request.firstName} </Typography>
                        <IconButton onClick={() => {handleAcceptRequest(request)}}><AddCircleRoundedIcon/></IconButton>
                        </div>
                    ))
                )}
            </Box>
        </div>
    )
}



export default FriendRequests
