import FeedCard from './FeedCard'
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'

export function updateFeed () {
    Feed.updateFeed()
}

const Feed = ({ feedCards, loggedIn, uid, userData }) => {
    function updateFeed () {
        setUpdate(true)
    }

    Feed.updateFeed = updateFeed

    const [update, setUpdate] = useState(false)

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
            {loggedIn === true ? (feedCardsMod.map((card, index) => (
                <div key={index}>
                    <FeedCard cardData={card} loggedIn={loggedIn} uid={uid} userData={userData} />
                </div>
            ))) : ('')}
        </>
    )
}

export default Feed
