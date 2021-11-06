import { useState } from 'react'
import { pushPost, getAllPosts } from '../utils/FeedUpdater'
import { postOne, postTwo, postThree, postFour } from './Feed'
import { Avatar, Box, Button, Card, CardContent, Modal } from '@material-ui/core'
import useStyles from './styles'
import NewPost from './NewPost'


const PostBar = ({ addFeedCard, loggedIn, uid}) => {
    const [newPostOpen, setNewPostOpen] = useState(false)
    const handleOpenNewPost = () => {
        setNewPostOpen(true)
    }
    const handleCloseNewPost = () => {
        setNewPostOpen(false)
    }



    const classes = useStyles()
    return (
        <>
            {loggedIn ? (<Card style={{ marginTop: ".5rem" }}>
                <CardContent className={classes.postbar}>
                    <Box style={{ display: "flex", gap: "10px" }}>
                        <Avatar style={{}} />
                        <Button className={classes.postbarAddPostButton} onClick= {handleOpenNewPost}>
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
                    <NewPost onCloseHandler={handleCloseNewPost} />
                </Box>
            </Modal>


            <div style={{ marginTop: "1rem" }}>


                <div />
                <Button onClick={() => { pushPost(uid, postOne, true) }}>Test FireBase Upload</Button>
                <div />
                <Button onClick={() => { getAllPosts(addFeedCard) }}>Test FireBase Download</Button>
            </div>

        </>

    )
}

export default PostBar
