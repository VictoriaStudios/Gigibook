import { useState, useEffect } from 'react'
import { Box, Container, Modal, Typography } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import NewPost from './NewPost'
import { getAllPosts } from '../utils/FeedUpdater'



const MainBody = ({loggedIn , uid}) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        console.log("addFeedCard being called, newFeedCards has the author of " + newFeedCard.author)
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }
        useEffect(() => {
            if (loggedIn === false) {
                console.log ("Not logged in")
                setFeedCards ([])
            }
            else {
                console.log ("Logged in")
                console.log (uid)
                getAllPosts(uid, addFeedCards)
            }}, [loggedIn])




    const classes = useStyles()
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                <PostBar addFeedCard={addFeedCards} loggedIn = {loggedIn} uid = {uid}/>
                <Feed feedCards={feedCards} loggedIn = {loggedIn} setFeedCards = {setFeedCards}/>
            </Container>
        </>
    )
}

export default MainBody
