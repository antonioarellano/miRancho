import { createStore, applyMiddleware } from 'redux';
import rootReducer from './ranchoReducer';
import thunk from 'redux-thunk'

// const persistConfig = {key: 'toor',storage: AsyncStorage,}

var initialState = {
  jwt:false,
  hato:[{arete:'0',name:'N/A'}],
  bkpHato:false,
  controles:[],
  vacunas:[],
  pesajes:[],
  perfil:[]
}
// const persistedReducer = persistReducer(persistConfig, ranchoReducer); 
// let persistor = persistStore(ranchoStore);
export default function store(){
    return createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk)
    );
}

