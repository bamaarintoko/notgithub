import logger from 'redux-logger'
import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
const middlewares: Middleware[] = [];
import notgithub from "./slice/notgithub"
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
if (process.env.NODE_ENV === `development`) {
    // const { logger } = require(`redux-logger`)
    middlewares.push(logger as Middleware)
}
const appReducers = combineReducers({
    notgithub
})

const persistConfig = {
    key: 'notgithub',
    storage: storage,
    whitelist: [
        'sliceUser'
    ]
}


const persistedReducer = persistReducer(persistConfig, appReducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
        }
    }).concat(
        ...middlewares)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;