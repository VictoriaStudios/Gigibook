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
        setFeedCards ([])
        if (loggedIn){
            getAllPosts(uid)
            .then ((cards) => {
                console.log ("Feedcards found")
                setFeedCards (cards)
            })
        }
    }

    MainBody.updateFeedCards = updateFeedCards

    useEffect(() => {
        console.log ("MB: Updating feed cards")
        updateFeedCards()
    }, [loggedIn])




    const classes = useStyles()
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                {userData.profileLink!=undefined ? (
                <PostBar addFeedCard={addFeedCards} loggedIn={loggedIn} uid={uid} userData={userData} />)
                :("")}
                <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} />
            </Container>
        </>
    )
}

export default MainBody
