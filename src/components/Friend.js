import { useState, useEffect } from "react"
import { addDeleteRequest ,deleteFriend, getUserData } from "../utils/UserDataManager"
import { Avatar, Box, Typography, IconButton } from "@material-ui/core"
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

const Friend = ({ friend, uid }) => {
    const [avatar, setAvatar] = useState("")
    const [friendData, setFriendData] = useState ([])
    const [removeFriendOpen, setRemoveFriendOpen] = useState (false)

    const handleRemoveFriendOpen = () => {
        setRemoveFriendOpen (true)
    }

    const handleRemoveFriendClose = () => {
        setRemoveFriendOpen (false)
    }

    const handleDeleteFriend = () => {
        deleteFriend (uid, friend)
        addDeleteRequest (uid, friend)
    }

    const getFriendData = () => {
        getUserData (friend)
            .then ((data) => {
                setFriendData (data)
                setAvatar(data.profileLink.link)
            })
            .catch (error => console.log (error))
    }

    useEffect(() => {
      getFriendData()
    }, []);
    

    return (
        <div>
            <Box style= {{display: "flex", alignItems:"center"}}>
                {avatar.length === 2 ? (
                    <Avatar style={{scale:"0.6"}}>{avatar} </Avatar>
                ): (
                    <Avatar src={avatar} style={{scale:"0.6"}}/>
                )}
                <Typography  variant="caption" >{friendData.firstName} </Typography>
                {!removeFriendOpen ? (
                    <IconButton onClick={handleRemoveFriendOpen} style={{width:"12px", height:"12px"}}> <CancelRoundedIcon/> </IconButton>
                ): (
                    <>
                    <IconButton onClick={handleDeleteFriend} style={{width:"12px", height:"12px"}}> <CheckCircleRoundedIcon/> </IconButton>
                    <IconButton onClick={handleRemoveFriendClose} style={{width:"12px", height:"12px"}}> <CancelRoundedIcon/> </IconButton>
                    </>
                )}
            </Box>

        </div>
    )
}

export default Friend