import { useState } from "react";
import { Avatar, Box, Button, Card, CardHeader, CardContent, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { pushPost } from "../utils/FeedUpdater";
import useStyles from "./styles";
import { getImageURL, saveImage } from "../utils/StorageManager";
import { updateFeedCards } from "./MainBody";


const NewPost = ({ uid, userData, onCloseHandler }) => {
    const [postContent, setPostContent] = useState("")
    const [friendsOnly, setFriendsOnly] = useState(false)
    const [image, setImage] = useState("")
    const [alt, setAlt] = useState("")
    const [wrongFile, setWrongFile] = useState(false)
    const [uploadErrorMessage, setUploadErrorMessage] = useState("")

    const initPost = () => {
        var imageURL = ""
        console.log ("InitPost started")
        if (image !== "")
        {
            checkImage()
            .then (() => {
                saveImage(image, uid)
                .then ((imageRef) => {
                    getImageURL(imageRef)
                    .then ((url) => {
                        imageURL=url
                        postData(imageURL)
                    })
                    .catch (error => console.log (error))
                })
                .catch ((error) => {
                    console.log (error)
                    setWrongFile(true)
                    setUploadErrorMessage(error)
                    setImage("")
                })

            })
            .catch((error) => {
                console.log (error)
                setWrongFile(true)
                setUploadErrorMessage(error)
                setImage("")
            })
        }
        else {
            postData (imageURL)
        }
    }

    function postData (imageURL) {
        const now = new Date(Date.now())
        const postData = {
            authorUid: uid,
            author: userData.firstName,
            date: now,
            img: imageURL,
            alt: alt,
            content: postContent,
        }
        pushPost(uid, postData, friendsOnly)
        updateFeedCards()
        onCloseHandler()
    }

    function checkImage() {
        console.log ("CheckImage called")
        return new Promise((resolve, reject) => {
            if (!image.type.match('image.*')) {
                console.log("Not an image!")
                reject("File is not an image")
            }
            else{
                var img = new Image()
                img.src = window.URL.createObjectURL(image)
                img.onload = function () {
                    const width = img.naturalWidth
                    const height = img.naturalHeight
                    if (width <= 2048 && height <= 2048) {
                        if (image.size/1024/1024 > 2) {
                            reject("Image is larger than 2 MB")
                        }
                        else{
                            resolve(true)
                        }
                        
                    }
                    else {
                        reject("Image is larger than 2048x2048px")
                    }
                }
            }
            
            window.URL.revokeObjectURL(img.src)
        })

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
                {/* if the profile link only consists of two letters, show there */}
                {userData.profileLink.link.length === 2 ? (
                    <CardHeader
                        avatar={<Avatar>{userData.profileLink.link}</Avatar>}
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

                    /* otherwise show the proper profile avatar */
                ) :
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
                    </CardHeader>}

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
                    {wrongFile ? (<h6 style={{ color: "red", textAlign: "center" }}> {uploadErrorMessage} </h6>) : ""}
                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" component="label">
                            Add Picture
                            <input onChange={(e) => { setImage(e.target.files[0], setUploadErrorMessage(""), setWrongFile(false)) }}
                                type="file"
                                hidden />
                        </Button>
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
