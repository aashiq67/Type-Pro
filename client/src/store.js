import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

const authInfoSlice = createSlice({
    name: 'auth',
    initialState: {
        username: String,
        email: String,
        isAuthenticated: false,
        accuracy: 0,
        score: 0
    },
    reducers: {
        login(state, action) {
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.email = '';
            state.isAuthenticated = false;
        },
        setStats(state, action) {
            state.accuracy = action.payload.accuracy;
            state.score = action.payload.score;
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