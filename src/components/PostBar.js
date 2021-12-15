import { useState, useEffect } from 'react'
import { Avatar, Box, Button, Card, CardContent, Modal } from '@material-ui/core'
import useStyles from './styles'
import NewPost from './NewPost'
import { getProfileImageLink } from '../utils/UserDataManager'

export function updateAvatar() {
    PostBar.getAvatar(PostBar.uid)
}

const PostBar = ({ loggedIn, uid, userData }) => {
    const [newPostOpen, setNewPostOpen] = useState(false)
    const [avatarVal, setAvatarVal] = useState("")
    const getAvatar = (uid) => {
        getProfileImageLink(uid)
            .then((url) => {
                setAvatarVal(url)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    PostBar.getAvatar = getAvatar
    PostBar.uid = uid
    const handleOpenNewPost = () => {
        setNewPostOpen(true)
    }
    const handleCloseNewPost = () => {
        setNewPostOpen(false)
    }

    useEffect(() => {
        if (loggedIn) {
            getAvatar(uid)
        }
    }, [loggedIn])


    const classes = useStyles()
    return (
        <>
            {loggedIn ? (<Card style={{ marginTop: ".5rem" }}>
                <CardContent className={classes.postbar}>
                    <Box style={{ display: "flex", gap: "10px" }}>
                        {avatarVal.length===2 ? (
                        <Avatar>{avatarVal}</Avatar>) : (
                            <Avatar src= {avatarVal}/>
                        )}
                        <Button className={classes.postbarAddPostButton} onClick={handleOpenNewPost}>
                            What's on your mind?
                        </Button>
                    </Box>
                </CardContent>
            </Card>) : ""}
            <Modal 
                open={newPostOpen}
                onClose={handleCloseNewPost}
                aria-labelledby="modal-modal-title"
                BackdropProps={{
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)"
                    }
                }}
            >
                <Box className={classes.modal}>
                    <NewPost uid={uid} userData={userData} onCloseHandler={handleCloseNewPost} />
                </Box>
            </Modal>
        </>

    )
}

export default PostBar
