import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const archiveSlice = createSlice({
  name: 'archive',
  initialState,
  reducers: {
    addToArchive: (state, action) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      )

      if (!exists) {
        state.items.push(action.payload)
      }
    },

    removeFromArchive: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },

    setArchive: (state, action) => {
      state.items = action.payload
    },
  },
})

export const { addToArchive, removeFromArchive, setArchive } =
  archiveSlice.actions

export default archiveSlice.reducer