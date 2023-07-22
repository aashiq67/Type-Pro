import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

const authInfoSlice = createSlice({
    name: 'auth',
    initialState: {
        username: String,
    },
    reducers: {
        setUsername(state, action) {
            state.username = action.payload.username;
        }
    }
});

const currInfoSlice = createSlice({
    name: 'Info',
    initialState: {
        gameMode: 'Easy',
        duration: 30,
        isCreated: false
    },
    reducers: {
        setGameMode(state, action) {
            state.gameMode = action.payload.gameMode
        },
        setDuration(state, action) {
            state.duration = action.payload.duration
        },
        setIsCreated(state, action) {
            state.isCreated = action.payload.isCreated
        }
    }
});

export const authInfo = authInfoSlice.actions;
export const currInfo = currInfoSlice.actions;

export const store = configureStore({
    reducer: combineReducers({
        authInfoReducer: authInfoSlice.reducer,
        currInfoReducer: currInfoSlice.reducer
    })
})