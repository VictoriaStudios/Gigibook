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

    useEffect(() => {
        console.log (`Feed: feedcard list:`)
        feedCards.forEach (card => console.log (card.path))
    }, [])

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
                    <FeedCard cardData={card} loggedIn={loggedIn} uid={uid} userData={userData} />
                </div>
            ))) : ('')}
        </>
    )
}

export default Feed
