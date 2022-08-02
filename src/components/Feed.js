import FeedCard from './FeedCard'
import { differenceInSeconds } from 'date-fns'
import { useSelector } from 'react-redux'

const Feed = ({ feedCards, updateFeedCards }) => {

    const userData = useSelector ((state) => state.userData.userData)
    var feedCardsMod = []
    //a function to sort all feed cards in descending time order
    const sortFeedCards = () => {
        feedCardsMod = feedCards.slice()
        feedCardsMod.forEach(card => {
            const elapsedSeconds = differenceInSeconds(Date.now(), card.date)
            card.elapsedSeconds = elapsedSeconds
        });
        feedCardsMod.sort ((a,b) => a.elapsedSeconds - b.elapsedSeconds);
    }

    const limitFeedCards = () => {
        if (feedCardsMod.length > 50) {
            feedCardsMod.length = 50
        }
    }

    return (
        <>
            {sortFeedCards()}
            {limitFeedCards()}
            {feedCardsMod.map((card, index) => (
                <div key={index}>
                    <FeedCard cardData={card} loggedIn={loggedIn} uid={uid} userData={userData} updateFeedCards={updateFeedCards}/>
                </div>
            ))}
        </>
    )
}

export default Feed
