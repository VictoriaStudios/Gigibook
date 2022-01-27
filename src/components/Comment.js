import { useState, useEffect } from "react";
import { getProfileImageLink } from "../utils/UserDataManager";
import Card from '@mui/material/Card';
import useStyles from "./styles";
import formatDistance from "date-fns/formatDistance";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

const Comment = ( {commentData}) => {
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
      getAvatar (commentData.authorUid);
    
    }, []);
    
    const classes = useStyles();
    const elapsedTime = formatDistance(commentData.date, Date.now(), { addSuffix: true })

  return (
  <>
    <Card className= {classes.FeedCard}>
    <p>{avatarVal}</p>
    <p>{elapsedTime}</p>
    </Card>
      
  </>)
}

export default Comment;
