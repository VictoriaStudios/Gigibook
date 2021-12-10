import { useEffect, useState } from "react"
import { Box, IconButton, Typography } from "@material-ui/core"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'


const SearchResults = ({ results }) => {
    const [iconState, setIconState] = useState([])
    function updateIconStates() {
        let newIconStates = []
        results.forEach((result) => {
            newIconStates.push ({state:"unclicked"})
        })
        setIconState (newIconStates)
    }

    useEffect(() => {
        updateIconStates()
    }, [])

    return (
        <div>
            {(results.length !== 0 || results === undefined) ? (
                results.map((result, index) => (
                    <Box key={index} style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <Typography style={{marginLeft:"5px"}} variant="h6" >{result.firstName}</Typography>
                        <IconButton><AddCircleRoundedIcon/></IconButton>
                    </Box>

                ))
            ) : <Typography variant="h6" style={{ textAlign: "center" }}>No friends found</Typography>}
        </div>
    )
}

export default SearchResults
