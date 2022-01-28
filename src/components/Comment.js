import { useState, useEffect } from "react";
import { getProfileImageLink } from "../utils/UserDataManager";
import Card from '@mui/material/Card';
import useStyles from "./styles";
import formatDistance from "date-fns/formatDistance";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Avatar, Box, IconButton, Typography } from "@material-ui/core";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

const Comment = ({ commentData }) => {
  const [avatarVal, setAvatarVal] = useState("");

  const getAvatar = (uid) => {
    getProfileImageLink(uid)
      .then((url) => {
        setAvatarVal(url)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAvatar(commentData.authorUid);

  }, []);

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
          </Typography>
        </CardContent>
      </Card>

    </>)
}

export default Comment;
