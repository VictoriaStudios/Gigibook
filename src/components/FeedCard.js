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
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import Typography from '@material-ui/core/Typography';
import { formatDistance } from 'date-fns'
import { useState, useEffect } from 'react';
import { getProfileImageLink } from '../utils/UserDataManager';
import { likePost, unLikePost } from '../utils/FeedUpdater';


const FeedCard = ({ cardData, uid }) => {
    const [postLiked, setPostLiked] = useState(false)
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
    const handleMoreButton = (e) => {

    }

    const handleLike = (e) => {
        console.log(`Handling like of ${cardData.author}'s post, id: ${cardData.id}`)
        if (!postLiked){
            likePost (uid, cardData)
            .then (getPostLiked(uid))
            .catch (error => console.log (error))
        }
        if (postLiked) {
            unLikePost (uid, cardData)
            .then (getPostLiked(uid))
            .catch (error => console.log (error))
        }
    }

    const handleComment = (e) => {

    }

    const handleShare = (e) => {

    }

    const getPostLiked = (uid) => {
        console.log ("GetPostLiked executed, uid: " + uid)
        let likeFound = false
        if (cardData.likeData.likeUids !== undefined) {
            if (cardData.likeData.likeUids.includes(uid)) {
                console.log("Found uid in likes")
                likeFound = true
            }
            else {
                console.log("Didn't find uid in likes")
                likeFound = false
            }
        }
        setPostLiked (likeFound)
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
                            <IconButton aria-label="settings" onClick={handleMoreButton}>
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
                    {cardData.likeData.likeCount > 0 ? (<div style={{ display: "flex" }}><ThumbUpRoundedIcon className={classes.feedCardLikeIcon} /><Typography variant="caption" style={{ alignSelf: "end" }}> {cardData.likeData.likeCount}</Typography></div>)
                        : ""}
                </CardContent>

                <CardActions className={classes.feedCardActionBar}>
                    {!postLiked? (
                        <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                            <ThumbUpRoundedIcon />
                            <Typography className={classes.feedCardActionDesc}> Like </Typography>
                        </IconButton>
                    ) : (
                        <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1", color:"blue" }}>
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

            </Card>
        </div>
    )
}

export default FeedCard
