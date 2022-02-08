import { useState, useEffect } from "react";
import { getProfileImageLink } from "../utils/UserDataManager";
import Card from '@mui/material/Card';
import useStyles from "./styles";
import formatDistance from "date-fns/formatDistance";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Avatar, Box, Button, IconButton, Popover, Typography } from "@material-ui/core";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import { likeComment, unLikeComment } from "../utils/FeedUpdater";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { removePost } from "../utils/FeedUpdater";

const Comment = ({ commentData, uid, getComments, getCommentsCount }) => {
  const [avatarVal, setAvatarVal] = useState("");
  const [commentLiked, setCommentLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [anchorModifyButton, setAnchorModifyButton] = useState(null)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [removeCommentOpen, setRemoveCommentOpen] = useState(false)
  var likeUpdating = false


  const handleLike = () => {
    if (!likeUpdating) {
      likeUpdating = true
      if (!commentLiked) {
        likeComment(uid, commentData.path)
          .then(() => {
            setCommentLiked(true)
            setLikeCount(likeCount + 1)
            likeUpdating = false
          })
          .catch(error => console.log(error))
      }
      if (commentLiked) {
        unLikeComment(uid, commentData.path)
          .then(() => {
            setCommentLiked(false)
            setLikeCount(likeCount - 1)
            likeUpdating = false
          })
          .catch(error => console.log(error))
      }
    }
  }

  useEffect(() => {
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

    getAvatar(commentData.authorUid)
    getCommentLiked()
  }, [commentData, uid])

  const classes = useStyles();
  const elapsedTime = formatDistance(commentData.date, Date.now(), { addSuffix: true })

  const handleMoreButtonOpen = (e) => {
    setAnchorModifyButton(e.currentTarget)
    setOptionsOpen(true)
  }

  const handleMoreButtonClose = (e) => {
    setAnchorModifyButton(null)
    setOptionsOpen(false)
  }

  const handleRemoveCommentOpen = (e) => {
    setRemoveCommentOpen(true)
  }

  const handleRemoveCommentClose = (e) => {
    setRemoveCommentOpen(false)
  }

  const handleDeleteComment = () => {
    removePost(commentData.path)
        .then(() => {
          getComments()
          getCommentsCount()
        })
        .catch((error) => console.log(error))
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
            {!commentLiked ? (
              <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <IconButton aria-label="like" onClick={handleLike} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                  <ThumbUpRoundedIcon style={{ maxHeight: "1rem" }} />
                  {likeCount > 0 ? (<div style={{ display: "inline" }}><Typography variant="caption" style={{ alignSelf: "end" }}> {likeCount}</Typography></div>)
                  : ""}
                  <Typography className={classes.commentActionDesc}> Like </Typography>
                </IconButton>
              </Box>
            ) : (
              <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <IconButton aria-label="like" onClick={handleLike} style={{ color: "blue" }} sx={{ borderRadius: "5%", flexGrow: "1" }}>
                  <ThumbUpRoundedIcon style={{ maxHeight: "1rem" }} />
                  {likeCount > 0 ? (<div style={{ display: "inline" }}><Typography variant="caption" style={{ alignSelf: "end" }}> {likeCount}</Typography></div>)
                  : ""}
                  <Typography className={classes.commentActionDesc}> Liked </Typography>
                </IconButton>
              </Box>
            )}
          </Typography>
        </CardContent>
      </Card>
      <Popover
        PaperProps={{ className: classes.popoverPaper }}
        open={optionsOpen}
        anchorEl={anchorModifyButton}
        onClose={() => { handleMoreButtonClose(); handleRemoveCommentClose() }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {(uid === commentData.authorUid) ? (
          <>
            {!removeCommentOpen ? (<Button onClick={handleRemoveCommentOpen}>
              <Typography style={{ marginLeft: "5px" }} variant="caption" > Remove </Typography>
            </Button>)
              : (<div>
                <IconButton style={{maxHeight:"0.5rem"}} onClick={handleDeleteComment}>
                  <CheckCircleRoundedIcon />
                </IconButton>
                <IconButton style={{maxHeight:"0.5rem"}} onClick={handleRemoveCommentClose}>
                  <CancelRoundedIcon />
                </IconButton>
              </div>)}
          </>

        ) : ("")}
      </Popover>


    </>)
}

export default Comment;
