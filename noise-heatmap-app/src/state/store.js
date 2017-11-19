import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { isTimeSelected } from './../ui/features/selectMenu.reducer'

const rootReducer = combineReducers({
    isTimeSelected
});

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(
        )
    )
);

export default store;