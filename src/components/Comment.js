import { useState, useEffect } from "react";
import { getProfileImageLink } from "../utils/UserDataManager";
import Card from '@mui/material/Card';
import useStyles from "./styles";
import formatDistance from "date-fns/formatDistance";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Avatar, Box, IconButton, Typography } from "@material-ui/core";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';


const Comment = ({ commentData, uid }) => {
  const [avatarVal, setAvatarVal] = useState("");
  const [commentLiked, setCommentLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const getAvatar = (uid) => {
    getProfileImageLink(uid)
      .then((url) => {
        setAvatarVal(url)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getCommentLiked = () => {
    let uidFound = false
    if (commentData.likeData.likeUids === undefined) return
    commentData.likeData.likeUids.forEach((entry) => {
      if (entry === uid) {
        uidFound = true
      }
    })
    if (uidFound) setCommentLiked(true)
    else setCommentLiked(false)

    if (commentData.likeData.likeCount !== undefined) {
      setLikeCount(commentData.likeData.likeCount)
    }
  }

  const handleLike = () => {
    console.log ("Handling Like")
  }

  useEffect(() => {
    getAvatar(commentData.authorUid)
    getCommentLiked()
  }, [])

  const classes = useStyles();
  const elapsedTime = formatDistance(commentData.date, Date.now(), { addSuffix: true })

  const handleMoreButtonOpen = (e) => {
    console.log("Click")
  }

  return (
    <>
      <Card className={classes.FeedCard}>
        {avatarVal.length === 2 ? (
          <CardHeader
            avatar={<Avatar> {avatarVal} </Avatar>}
            title={commentData.author}
            subheader={<Box>
              {elapsedTime}
              <p style={{ fontSize: "0.875rem", display: "inline" }}></p>
            </Box>}
            action={
              <IconButton aria-label="settings" onClick={handleMoreButtonOpen}>
                <MoreHorizRoundedIcon />
              </IconButton>
            }
          />
        ) : (
          <CardHeader
            avatar={<Avatar src={avatarVal} />}
            title={commentData.author}
            subheader={<Box>
              {elapsedTime}
              <p style={{ fontSize: "0.875rem", display: "inline" }}></p>
            </Box>}
            action={
              <IconButton aria-label="settings" onClick={handleMoreButtonOpen}>
                <MoreHorizRoundedIcon />
              </IconButton>
            }
          />)}

        <CardContent>
          <Typography variant="body2" gutterBottom>
            {commentData.content}
            {/*Show Likes if available*/}
            {/*likeCount > 0 ? (<div style={{ display: "flex" }}><ThumbUpRoundedIcon className={classes.feedCardLikeIcon} /><Typography variant="caption" style={{ alignSelf: "end" }}> {likeCount}</Typography></div>)
              : ""*/}
            {!commentLiked ? (
              <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}>
              <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                <ThumbUpRoundedIcon style={{maxHeight:"1rem"}} />
                <Typography className={classes.commentActionDesc}> Like </Typography>
              </IconButton>
              </Box>
            ) : (
              <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1", color: "blue" }}>
                <ThumbUpRoundedIcon />
                <Typography className={classes.feedCardActionDesc}> Like </Typography>
              </IconButton>
            )}
          </Typography>
        </CardContent>
      </Card>

    </>)
}

export default Comment;
