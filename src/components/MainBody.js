import { useState, useEffect } from 'react'
import { Container } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import { getAllPosts } from '../utils/FeedUpdater'

export function updateFeedCards () {
    MainBody.updateFeedCards()
}

export function updateFeedCardsWithId () {
    MainBody.updateFeedCardsWithId()
}

const MainBody = ({ loggedIn, uid, userData }) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }

    const updateFeedCards = () => {
        console.log ("updateFeedCards, uid is " + uid)
        setFeedCards ([])
        if (loggedIn){
            getAllPosts(uid)
            .then ((cards) => {
                console.log ("Feedcards found")
                setFeedCards (cards)
            })
        }
    }

    const updateFeedCardsWithId = (userId) => {
        console.log ("updateFeedCardsWithId, uid is " + userId)
        setFeedCards ([])
        if (loggedIn){
            getAllPosts(userId)
            .then ((cards) => {
                console.log ("Feedcards found")
                setFeedCards (cards)
            })
        }
    }

    MainBody.updateFeedCards = updateFeedCards

    MainBody.updateFeedCardsWithId = updateFeedCardsWithId

    useEffect(() => {
        console.log ("MB: Updating feed cards")
        updateFeedCards()
    }, [loggedIn])




    const classes = useStyles()
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                <PostBar addFeedCard={addFeedCards} loggedIn={loggedIn} uid={uid} userData={userData} />
                <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} />
            </Container>
        </>
    )
}

export default MainBody
