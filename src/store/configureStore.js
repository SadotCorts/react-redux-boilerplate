import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistState } from 'redux-devtools'
import { createStore, applyMiddleware, compose } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import DevTools from '../containers/DevTools'

const loggerMiddleware = createLogger()
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history)

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        historyMiddleware
    ),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument(),
    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    persistState(getDebugSessionKey())
);

function getDebugSessionKey() {
    // You can write custom logic here!
    // By default we try to read the key from ?debug_session=<key> in the address bar
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    return (matches && matches.length > 0) ? matches[1] : null
}

export default function configureStore(initialState) {
    // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
    // See https://github.com/rackt/redux/releases/tag/v3.1.0
    const store = createStore(rootReducer, initialState, enhancer)

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
        )
    }

    return store
}