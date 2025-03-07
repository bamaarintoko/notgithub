import { createSlice } from '@reduxjs/toolkit'

const notgithub = createSlice({
    name: 'notgithub',
    initialState: {
        data: {}
    },
    reducers: {
        storeData: () => { 
            
        }
    }
})

export const {
    storeData
} = notgithub.actions

export default notgithub.reducer