import { configureStore } from '@reduxjs/toolkit'
import archiveReducer from '../features/archive/archiveSlice'

export const store = configureStore({
  reducer: {
    archive: archiveReducer,
  },
})