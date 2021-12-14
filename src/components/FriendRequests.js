import { useState, useEffect } from "react"
import { getFriendRequests } from "../utils/UserDataManager"
import { Box, Typography } from "@material-ui/core"

const FriendRequests = ({uid}) => {
    const [requests, setRequests] = useState([])

    function updateFriendRequests () {
        getFriendRequests(uid).then (foundRequests => setRequests(foundRequests))
            .catch (error => console.log (error))
    }

    useEffect(() => {
        updateFriendRequests()
    }, [])

    return (
        <div>
            <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}>
                {requests.length===0 ? (
                    <>
                        <p>Loading</p>
                    </>
                ): (
                    requests.map((request, index) => (
                        <Typography style={{marginLeft:"5px"}} variant="caption" >{request}  </Typography>
                    ))
                )}
            </Box>
        </div>
    )
}



export default FriendRequests
