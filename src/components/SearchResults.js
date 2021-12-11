import { useEffect, useState } from "react"
import { Box, IconButton, Typography } from "@material-ui/core"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import { checkIfFriend, checkIfFriendRequest } from "../utils/UserDataManager"


const SearchResults = ({ results, uid }) => {
    const [updatedResults, setUpdatedResults] = useState([])
    function updateIconStates() {
        doAllIconUpdates()
            .then (results => setUpdatedResults(results))
            .catch(error => console.log (error))
    }

    function doAllIconUpdates () {
        return new Promise ((resolve, reject) => {
            let newResults = []
            results.forEach((result, index) => {
                let currentResult = result
                checkIfFriend(result.uid, uid)
                    .then((isFriend) => {
                        if (isFriend) {
                            currentResult.state = "friend"
                            newResults.push (currentResult)
                            if (index === results.length-1)
                            resolve (newResults)
                        }
                        else {
                            console.log ("Not a friend")
                            checkIfFriendRequest(result.uid, uid)
                                .then ((isRequested) => {
                                    if (isRequested) {
                                        currentResult.state ="requested"
                                        newResults.push (currentResult)
                                        console.log ("Requested true")
                                        if (index === results.length-1)
                                        resolve (newResults)
                                    }
                                    else {
                                        currentResult.state = "unrequested"
                                        newResults.push (currentResult)
                                        console.log ("Requested false")
                                        if (index === results.length-1)
                                        resolve (newResults)
                                    }
                                })
                                .catch (error => reject (error))
                        }
                    })
                    .catch (error => reject (error))
            })



        })
        
    }

    useEffect(() => {
        updateIconStates()
    }, [])

    return (
        <div>
            {(results.length !== 0 || results === undefined) ? (
                results.map((result, index) => (
                    <Box key={index} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}>
                        {updatedResults.length === 0 ? (
                            <p>Loading</p>
                        ) : (
                            <>
                            <Typography style={{marginLeft:"5px"}} variant="caption" >{result.firstName} {result.lastName} </Typography>
                            <IconButton><AddCircleRoundedIcon/></IconButton>
                            </>
                        )}
                        
                    </Box>

                ))
            ) : <Typography variant="h6" style={{ textAlign: "center" }}>No friends found</Typography>}
        </div>
    )
}

export default SearchResults
