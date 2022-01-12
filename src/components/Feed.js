import FeedCard from './FeedCard'
import { differenceInSeconds } from 'date-fns'



const Feed = ({ feedCards, loggedIn, uid }) => {
    var feedCardsMod = []
    //a function to sort all feed cards in descending time order
    const sortfeedCards = (feedCards) => {
        feedCardsMod = feedCards.slice()
        feedCardsMod.forEach(card => {
            const elapsedSeconds = differenceInSeconds(Date.now(), card.date)
            card.elapsedSeconds = elapsedSeconds
        });
        feedCardsMod.sort ((a,b) => a.elapsedSeconds - b.elapsedSeconds);

    }

    return (
        <>
            {sortfeedCards(feedCards)}
            {loggedIn === true ? (feedCardsMod.map((card, index) => (
                <div key={index}>
                    <FeedCard cardData={card} loggedIn={loggedIn} uid={uid}/>
                </div>
            ))) : ('')}
        </>
    )
}

export default Feed
