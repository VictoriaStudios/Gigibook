import FeedCard from './FeedCard'
import { CardData } from '../classes/CardData'
import { differenceInSeconds } from 'date-fns'
import avatar1 from '../avatars/1.jpg'
import avatar2 from '../avatars/2.jpg'
import avatar3 from '../avatars/3.jpg'
import avatar4 from '../avatars/4.jpg'
import example1 from '../userMedia/example-work.jpg'
import example2 from '../userMedia/example-travel.jpg'
import example3 from '../userMedia/example-food.jpg'




var date1 = new Date(2021, 8, 25, 19, 20);
var date2 = new Date(2021, 7, 25, 19, 17);
var date3 = new Date(2021, 8, 23, 5, 4);
var date4 = new Date(2021, 8, 27, 8, 20);

export var postOne = new CardData("Random User A", avatar1, date1, example1, "An example desktop image", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus dolore ullam eveniet?", 2)
export var postTwo = new CardData("Random User B", avatar2, date2, null, null, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos hic sint dolores accusamus necessitatibus ratione, odit quam dicta fuga libero.", 0)
export var postThree = new CardData("Random User C", avatar3, date3, example2, "An example vacation image", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus dolore ullam eveniet?", 10)
export var postFour = new CardData("Random User D", avatar4, date4, example3, "An example food image", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus dolore ullam eveniet?", 6)

const Feed = ({ feedCards, loggedIn }) => {
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
            {loggedIn === true ? (feedCardsMod.map((card) => (
                <>
                    <FeedCard key={card.id} cardData={card} />
                </>
            ))) : ('')}
        </>
    )
}

export default Feed
