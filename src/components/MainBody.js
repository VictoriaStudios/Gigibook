import { useState, useEffect } from 'react'
import { Container } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import { getAllPosts } from '../utils/FeedUpdater'



const MainBody = ({ loggedIn, uid, userData }) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }
    useEffect(() => {
        if (loggedIn === false) {
            setFeedCards([])
        }
        else {
            getAllPosts(uid, addFeedCards)
        }
    }, [loggedIn])




    const classes = useStyles()
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                <PostBar addFeedCard={addFeedCards} loggedIn={loggedIn} uid={uid} userData={userData} />
                <Feed feedCards={feedCards} loggedIn={loggedIn} />
            </Container>
        </>
    )
}

export default MainBody
