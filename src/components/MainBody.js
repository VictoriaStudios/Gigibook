import {useState, useEffect, useCallback} from 'react'
import {Typography, Container} from '@material-ui/core'
import useStyles from './styles'
import PostBar from './PostBar'
import Feed from './Feed'
import {getAllPosts} from '../utils/FeedUpdater'
import {useSelector, useDispatch} from 'react-redux';


export function updateFeedCardsWithId() {
    MainBody.updateFeedCardsWithId()
}

const MainBody = () => {
    const [feedCards, setFeedCards] = useState([])
    const loggedIn = useSelector ((state) => state.userData.loggedIn)
    const uid = useSelector ((state) => state.userData.uid)
    const userData = useSelector ((state) => state.userData.userData)

    const addFeedCards = (newFeedCard) => {
        setFeedCards(feedCards => [...feedCards, newFeedCard])
    }
    const dispatch = useDispatch()
    const guestUid = "oLqj5KQ4IJYtKN9PKNaU1XGifD33"


    const updateFeedCards = useCallback(() => {
        setFeedCards([])
        if (loggedIn) {
            getAllPosts(uid, true)
                .then((cards) => {
                    setFeedCards(cards)
                })
        }
        else {
            getAllPosts(guestUid, false)
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
                    <PostBar updateFeedCards={updateFeedCards} />
                    <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards} />
                </Container>
            ) : (
                <Container maxWidth="md" className={classes.container}>
                    <div style={{textAlign: "center"}}>
                        <Typography variant='h2'>Welcome to Gigibook</Typography>
                        <Typography variant='h3'>Sign up to post and comment</Typography>
                    </div>
                    <Feed feedCards={feedCards} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards} />
                </Container>
            )}
            <Typography variant='h6' style={{
                position: "fixed",
                bottom: "1%",
                right: "1%",
                fontSize: ".75rem",
                opacity: ".75"
            }}>© Marcel Bruna 2022</Typography>

        </>
    )
}

export default MainBody
