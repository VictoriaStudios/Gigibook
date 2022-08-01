import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '../utils/userDataSlice'

export const store = configureStore({
  reducer: {
      userData:  userDataReducer,
  },
})

