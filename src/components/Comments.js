import { useState, useEffect } from "react";
import { addComment, getAllComments } from "../utils/FeedUpdater";
import { Box, TextField, IconButton } from "@material-ui/core";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Comment from "./Comment";



const Comments = ({ cardData, uid, userData }) => {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState ("")

  let commentBusy = false

  function getComments() {
    console.log("Getting all comments")
    getAllComments(cardData.path).then((results) => setComments(results))
  }

  function handleSubmit() {
    if (!commentBusy) {
      console.log ("Submitting")
      commentBusy = true
      addComment (cardData, uid, userData, commentText)
        .then (() => {
          console.log ("Here")
          setCommentText ("")
          getComments()
          commentBusy = false
        })
        .catch (error => console.log (error))
    }
    
  }

  useEffect(() => {
    getComments()


  }, [])

  return(
  <div>
    <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}>
    <TextField
      variant="outlined"
      hiddenLabel
      multiline
      placeholder="Write a comment..."
      value = {commentText}
      onChange={(e) => setCommentText(e.target.value)}
      style={{backgroundColor:"#00000005",flexGrow:"1"}}
    >
    </TextField>
    <IconButton style={{display:"inline-flex"}} onClick={handleSubmit}>
      <SendRoundedIcon/>
    </IconButton>
    </Box>
    <Box>
      {comments.map((commentData, index) => (
        <>
        <div key = {`comment ${index}`}>
          <Comment commentData = {commentData} uid={uid} getComments={getComments} />
        </div>
        </>
      ))}
    </Box>
  </div>
  )
}

export default Comments;
