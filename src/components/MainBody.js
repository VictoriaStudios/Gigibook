import { useState, useEffect } from 'react'
import { Container } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import { getAllPosts } from '../utils/FeedUpdater'

export function updateFeedCards () {
    MainBody.updateFeedCards()
}

const MainBody = ({ loggedIn, uid, userData }) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }

    const updateFeedCards = () => {
        setFeedCards([])
        getAllPosts(uid, addFeedCards)
    }

    MainBody.updateFeedCards = updateFeedCards

    useEffect(() => {
        if (loggedIn === false) {
            setFeedCards([])
        }
        else {
            updateFeedCards()
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
