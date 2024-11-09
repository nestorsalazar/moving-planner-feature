
import { configureStore } from '@reduxjs/toolkit'
import generaReducer from './general.slides'
export default configureStore({
  reducer: {
    general: generaReducer
  },
})