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
import { format, formatDistance } from 'date-fns'

const handleMoreButton = (e) => {

}

const handleLike = (e) => {

}

const handleComment = (e) => {

}

const handleShare = (e) => {

}


const FeedCard = ({ cardData }) => {
    const classes = useStyles();
    const dateString = format(cardData.date, 'dd/MM/yyyy')
    const elapsedTime = formatDistance(cardData.date, Date.now(), { addSuffix: true })
    const now = format(Date.now(), 'dd/MM/yyyy')
    return (
        <div style={{ marginTop: "1rem" }}>
            <Card className= {classes.FeedCard}>
                <CardHeader
                    avatar={<Avatar src={cardData.avatar} />}
                    title={cardData.author}
                    subheader={elapsedTime}
                    action={
                        <IconButton aria-label="settings" onClick={handleMoreButton}>
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    }
                />

                <CardContent>
                    <Typography variant="body2" gutterBottom>
                       {cardData.content}
                    </Typography>

                    {/* Show Image if available */}
                    {cardData.img != null ? (<CardMedia
                        component="img"
                        image={cardData.img}
                        alt={cardData.alt}
                        sx={{ maxHeight: "65vh" }}
                    />) : ""}

                    {/*Show Likes if available*/}
                    {cardData.likeCount > 0 ? (<div style={{display:"flex"}}><ThumbUpRoundedIcon className={classes.feedCardLikeIcon}/><Typography variant="caption" style={{alignSelf:"end"}}> {cardData.likeCount}</Typography></div>)
                    : ""}
                </CardContent>

                <CardActions className = {classes.feedCardActionBar}>
                    <IconButton aria-label="like" onClick={handleLike} sx={{borderRadius:"5%", flexGrow: "1"}}>
                        <ThumbUpRoundedIcon />
                        <Typography className={classes.feedCardActionDesc}> Like </Typography>      
                    </IconButton>
                    <IconButton aria-label="comment" onClick={handleComment} sx={{borderRadius:"5%", flexGrow: "1"}}>
                        <ChatRoundedIcon />
                        <Typography className={classes.feedCardActionDesc}> Comment </Typography>
                    </IconButton>
                    <IconButton aria-label="share" onClick={handleShare} sx={{borderRadius:"5%", flexGrow: "1"}}>
                        <ShareRoundedIcon />
                    <Typography className={classes.feedCardActionDesc}> Share </Typography>
                    </IconButton>
                </CardActions>

            </Card>
        </div>
    )
}

export default FeedCard
