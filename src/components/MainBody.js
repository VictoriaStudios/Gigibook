import { useState, useEffect, useCallback } from 'react'
import { Typography, Container } from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import { getAllPosts } from '../utils/FeedUpdater'


export function updateFeedCardsWithId() {
    MainBody.updateFeedCardsWithId()
}

const MainBody = ({ loggedIn, uid, userData }) => {
    const [feedCards, setFeedCards] = useState([])
    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }

    const updateFeedCards = useCallback(() => {
        setFeedCards([])
        if (loggedIn) {
            getAllPosts(uid)
                .then((cards) => {
                    setFeedCards(cards)
                })
        }
    }, [uid, loggedIn])

    const updateFeedCardsWithId = (userId) => {
        setFeedCards([])
        if (loggedIn) {
            getAllPosts(userId)
                .then((cards) => {
                    setFeedCards(cards)
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
            {loggedIn ? (
                <Container maxWidth="md" className={classes.container}>
                    <PostBar addFeedCard={addFeedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards} />
                    <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards} />
                </Container>
            ) : (
                <Container maxWidth="md" className={classes.container}>
                    <div className={classes.deadCenter} style={{ textAlign:"center"}}>
                    <Typography variant='h1'>Welcome to Gigibook</Typography>
                    <Typography variant='h2'>a demo social media website</Typography>
                    </div>
                </Container>
            )}
            <Typography variant='h6' style={{
                position:"fixed",
                bottom:"1%",
                right:"1%",
                fontSize:".75rem",
                opacity:".75"
            }}>© Marcel Bruna 2022</Typography>

        </>
    )
}

export default MainBody
