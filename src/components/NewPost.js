import { useState } from "react";
import { Avatar, Box, Button, Card, CardHeader, CardContent, TextField, Typography } from "@material-ui/core";
import { pushPost } from "../utils/FeedUpdater";


const NewPost = ({uid, userData, onCloseHandler}) => {
    const [postContent, setPostContent] = useState("")

    const initPost = () => {

    }


    return (
        <div>
            <Typography gutterbottom variant="h5" align="center" >
                Write a new post
            </Typography>
            <Card>
                <CardHeader
                    avatar={<Avatar src={userData.profileLink.link}/>}
                    title={userData.firstName} >
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
                        <Button onClick={() => {initPost()}}>
                            Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>

        </div>
    )
}

export default NewPost
