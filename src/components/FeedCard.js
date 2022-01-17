import useStyles from './styles';
import Avatar from '@material-ui/core/Avatar'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { Box, Button, Modal, Popover } from '@material-ui/core';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import Typography from '@material-ui/core/Typography';
import { formatDistance } from 'date-fns'
import { useState, useEffect } from 'react';
import { getProfileImageLink } from '../utils/UserDataManager';
import { likePost, unLikePost } from '../utils/FeedUpdater';
import ModifyPost from './ModifyPost';


const FeedCard = ({ cardData, uid, userData }) => {
    const [postLiked, setPostLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [avatarVal, setAvatarVal] = useState("")
    const [optionsOpen, setOptionsOpen] = useState(false)
    const [modifyPostOpen, setModifyPostOpen] = useState(false)
    var likeUpdating = false
    const moreButtonRef = document.getElementById("moreButton")
    const getAvatar = (uid) => {
        getProfileImageLink(uid)
            .then((url) => {
                setAvatarVal(url)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleMoreButton = (e) => {
        setOptionsOpen(!optionsOpen)
    }

    const handleOpenModifyPost = (e) => {
        setModifyPostOpen (true)
    }

    const handleCloseModifyPost = (e) => {
        setModifyPostOpen (false)
        setOptionsOpen (false)
    }

    const handleLike = (e) => {
        if (!likeUpdating) {
            likeUpdating = true
            if (!postLiked) {
                likePost(uid, cardData.path)
                    .then(() => {
                        setPostLiked(true)
                        setLikeCount(likeCount + 1)
                        likeUpdating = false
                    })
                    .catch(error => console.log(error))
            }
            if (postLiked) {
                unLikePost(uid, cardData.path)
                    .then(() => {
                        setPostLiked(false)
                        setLikeCount(likeCount - 1)
                        likeUpdating = false
                    })
                    .catch(error => console.log(error))
            }
        }

    }

    const handleComment = (e) => {

    }

    const handleShare = (e) => {

    }

    const getPostLiked = (uid) => {
        let uidFound = false
        if (cardData.likeData.likeUids === undefined) return
        cardData.likeData.likeUids.forEach((entry) => {
            if (entry === uid) {
                uidFound = true
            }
        })
        if (uidFound) setPostLiked(true)
        else setPostLiked(false)

        if (cardData.likeData.likeCount !== undefined) {
            setLikeCount(cardData.likeData.likeCount)
        }
    }

    useEffect(() => {
        getPostLiked(uid)
    }, [])


    const classes = useStyles();
    const elapsedTime = formatDistance(cardData.date, Date.now(), { addSuffix: true })
    return (
        <div style={{ marginTop: "1rem" }}>
            {getAvatar(cardData.authorUid)}
            {/*getPostLiked(uid)*/}
            <Card className={classes.FeedCard}>
                {avatarVal.length === 2 ? (
                    <CardHeader
                        avatar={<Avatar> {avatarVal} </Avatar>}
                        title={cardData.author}
                        subheader={elapsedTime}
                        action={
                            <IconButton aria-label="settings" onClick={handleMoreButton}>
                                <MoreHorizRoundedIcon />
                            </IconButton>
                        }
                    />
                ) : (
                    <CardHeader
                        avatar={<Avatar src={avatarVal} />}
                        title={cardData.author}
                        subheader={elapsedTime}
                        action={
                            <IconButton id="moreButton" aria-label="settings" onClick={handleMoreButton}>
                                <MoreHorizRoundedIcon />
                            </IconButton>
                        }
                    />)}


                <CardContent>
                    <Typography variant="body2" gutterBottom>
                        {cardData.content}
                    </Typography>

                    {/* Show Image if available */}
                    {cardData.img !== null && cardData.img !== undefined && cardData.img !== "" ? (<CardMedia
                        component="img"
                        image={cardData.img}
                        alt={cardData.alt}
                        sx={{ maxHeight: "65vh" }}
                    />) : ""}

                    {/*Show Likes if available*/}
                    {likeCount > 0 ? (<div style={{ display: "flex" }}><ThumbUpRoundedIcon className={classes.feedCardLikeIcon} /><Typography variant="caption" style={{ alignSelf: "end" }}> {likeCount}</Typography></div>)
                        : ""}
                </CardContent>

                <CardActions className={classes.feedCardActionBar}>
                    {!postLiked ? (
                        <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                            <ThumbUpRoundedIcon />
                            <Typography className={classes.feedCardActionDesc}> Like </Typography>
                        </IconButton>
                    ) : (
                        <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1", color: "blue" }}>
                            <ThumbUpRoundedIcon />
                            <Typography className={classes.feedCardActionDesc}> Like </Typography>
                        </IconButton>
                    )}

                    <IconButton aria-label="comment" onClick={handleComment} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                        <ChatRoundedIcon />
                        <Typography className={classes.feedCardActionDesc}> Comment </Typography>
                    </IconButton>
                    <IconButton aria-label="share" onClick={handleShare} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                        <ShareRoundedIcon />
                        <Typography className={classes.feedCardActionDesc}> Share </Typography>
                    </IconButton>
                </CardActions>
                <Popover
                    open={optionsOpen}
                    anchorEl={moreButtonRef}
                    onClose={handleMoreButton}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Button onClick={handleOpenModifyPost}>
                        <Typography style={{ marginLeft: "5px" }} variant="caption" > Modify </Typography>
                    </Button>
                </Popover>
            </Card>
            <Modal 
                open={modifyPostOpen}
                onClose={handleCloseModifyPost}
                aria-labelledby="modal-modal-title"
                BackdropProps={{
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)"
                    }
                }}
            >
                <Box className={classes.modal}>
                    <ModifyPost uid={uid} userData={userData} cardData={cardData} onCloseHandler={handleCloseModifyPost} />
                </Box>
            </Modal>
        </div>
    )
}

export default FeedCard
