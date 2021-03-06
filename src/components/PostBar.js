import { useState, useEffect } from 'react'
import { Avatar, Box, Button, Card, CardContent, Modal } from '@material-ui/core'
import useStyles from './styles'
import NewPost from './NewPost'
import { getProfileImageLink } from '../utils/UserDataManager'
import {useSelector} from 'react-redux';

export function updateAvatar(userId) {
    console.log ("updateAvatar called")
    PostBar.getAvatar(userId)
}

const PostBar = ({  updateFeedCards }) => {
    const [newPostOpen, setNewPostOpen] = useState(false)
    const [avatarVal, setAvatarVal] = useState("")
    const loggedIn = useSelector ((state) => state.userData.loggedIn)
    const uid = useSelector ((state) => state.userData.uid)
    const getAvatar = (userId) => {
        getProfileImageLink(userId)
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
        if (!loggedIn) {
            setAvatarVal ("")
        }
    }, [loggedIn, uid])


    const classes = useStyles()
    return (
        <>
            {avatarVal !== "" ? (
                <>
                    <Card style={{ marginTop: ".5rem" }}>
                        <CardContent className={classes.postbar}>
                            <Box style={{ display: "flex", gap: "10px" }}>
                                {avatarVal.length === 2 ? (
                                    <Avatar>{avatarVal}</Avatar>) : (
                                    <Avatar src={avatarVal} />
                                )}
                                <Button className={classes.postbarAddPostButton} onClick={handleOpenNewPost}>
                                    What's on your mind?
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
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
                            <NewPost onCloseHandler={handleCloseNewPost} updateFeedCards={updateFeedCards}/>
                        </Box>
                    </Modal>
                </>
            ) : ("")}

        </>

    )
}

export default PostBar
