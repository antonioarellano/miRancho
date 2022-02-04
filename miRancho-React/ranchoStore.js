
import { createStore } from 'redux';
import rootReducer from './ranchoReducer';

// const persistConfig = {key: 'toor',storage: AsyncStorage,}
const state = {
    jwt:false,
    hato:[],
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
      state
    );
}

