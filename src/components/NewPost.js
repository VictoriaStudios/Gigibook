import { useState } from "react";
import { Box, Button, Card, CardHeader, CardContent, TextField, Typography } from "@material-ui/core";
import { pushPost } from "../utils/FeedUpdater";


const NewPost = (userData, {onCloseHandler}) => {
    const [postContent, setPostContent] = useState("")




    return (
        <div>
            <Typography variant="h5" align="center" gutterbottom>
                Write a new post
            </Typography>
            <Card>
                <CardHeader
                    avatar="AvatarGoesHere"
                    subheader={userData.firstName} >
                </CardHeader>
                <CardContent>
                    <TextField
                        variant="outlined"
                        hiddenLabel
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="What's on your mind?"
                        onChange = {(e) => setPostContent(e.target.value)}
                        >
                    </TextField>
                    <Box style={{textAlign:"center"}}>
                        <Button onClick={{}}>
                            Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>

        </div>
    )
}

export default NewPost
