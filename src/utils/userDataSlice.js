import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  uid: null,
  loggedIn: false,
  userData: '',
  friends: [] 
}

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUid: (state, action) => {
      state.uid = action. payload
    },
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setFriends: (state, action) => {
      state.friends += action.payload
    },
  },
})

export const { setUid, setUserData, setFriends, setLoggedIn } = userDataSlice.actions

export default userDataSlice.reducer
