import { useState, useEffect, useCallback } from 'react'
import { Container } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import { getAllPosts } from '../utils/FeedUpdater'


export function updateFeedCardsWithId () {
    MainBody.updateFeedCardsWithId()
}

const MainBody = ({ loggedIn, uid, userData }) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }

    const updateFeedCards = useCallback (() => {
        setFeedCards ([])
        if (loggedIn){
            getAllPosts(uid)
            .then ((cards) => {
                setFeedCards (cards)
            })
        }
    }, [uid, loggedIn])

    const updateFeedCardsWithId = (userId) => {
        setFeedCards ([])
        if (loggedIn){
            getAllPosts(userId)
            .then ((cards) => {
                setFeedCards (cards)
            })
        }
    }


    MainBody.updateFeedCardsWithId = updateFeedCardsWithId

    useEffect(() => {
        updateFeedCards()
    }, [loggedIn, updateFeedCards])




    const classes = useStyles()
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                <PostBar addFeedCard={addFeedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards} />
                <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards}/>
            </Container>
        </>
    )
}

export default MainBody
