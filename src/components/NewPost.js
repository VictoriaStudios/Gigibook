import { useState } from "react";
import { Avatar, Box, Button, Card, CardHeader, CardContent, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { pushPost } from "../utils/FeedUpdater";
import useStyles from "./styles";


const NewPost = ({ uid, userData, onCloseHandler }) => {
    const [postContent, setPostContent] = useState("")
    const [friendsOnly, setFriendsOnly] = useState(false)
    const [image, setImage] = useState("")
    const [alt, setAlt] = useState("")

    const initPost = () => {
        const now = new Date (Date.now())
        const postData = {
            author: userData.firstName,
            avatar: userData.profileLink.link,
            date: now,
            img: image,
            alt: alt,
            content: postContent,
            likeCount: 0
        }
        pushPost(uid, postData, friendsOnly)
        onCloseHandler()

    }

    const handleChange = (e) => {
        setFriendsOnly(e.target.value)
    }

    const classes = useStyles()

    return (
        <div>
            <Typography variant="h6" align="center" className={classes.newPostTitle}>
                Write a new post
            </Typography>
            <Card>
                <CardHeader
                    avatar={<Avatar src={userData.profileLink.link} />}
                    title={userData.firstName}
                    subheader={<Select
                        labelId="select-visibility"
                        id="select-visibility"
                        value={friendsOnly}
                        label="public"
                        onChange={handleChange}
                        style={{ fontSize: "0.875rem" }}
                    >
                        <MenuItem value={false}>public</MenuItem>
                        <MenuItem value={true}>private</MenuItem>
                    </Select>}>
                </CardHeader>
                <CardContent>

                    <TextField
                        variant="outlined"
                        hiddenLabel
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="What's on your mind?"
                        onChange={(e) => setPostContent(e.target.value)}
                    >
                    </TextField>
                    <Box style={{ textAlign: "center" }}>
                        <Button onClick={initPost}>
                            Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>

        </div>
    )
}

export default NewPost
