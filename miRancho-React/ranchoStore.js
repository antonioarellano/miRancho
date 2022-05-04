import { createStore, applyMiddleware } from 'redux';
import rootReducer from './ranchoReducer';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {key: 'toor',storage: AsyncStorage}

var initialState = {
  jwt:false,
  hato:[{arete:'0',name:'N/A'}],
  bkpHato:false,
  sanitarios:[{id:'0',name:'N/A',fecha:'N/A'}],
  bkpSanitarios:false,
  ctl_animal:[],
  embarazos:[],
  bkpEmbarazos:false,
  cria:[],
  vacunas:[{id:'0',name:'N/A',fecha:'N/A'}],
  bkpVacunas:false,
  vac_animal:[],
  pesajes:[{id:'0',date:'N/A',kg:'N/A'}],
  bkpPesajes:false,
  predios:[{name:'N/A',agua:true, pasto:true}],
  bkpPredios:false,
  predio_animal:[],
  perfil:[],
  errors: {hato:null,trans:0},
  trans:[],
  mtr:{hato:null,sanitarios:null,ctl_animal:null,crias:null,embarazos:null,pesajes:null,predios:null,predio_animal:null,perfil:null,vacunas:null,vac_animal:null}, 
  local:{sanitarios:0,predios:0,vacunas:0}
}
const persistedReducer = persistReducer(persistConfig, rootReducer); 

export default function Store(){
    let store = createStore(
      persistedReducer,
      initialState,
      applyMiddleware(thunk) 
    );
    let persistor = persistStore(store);
    return [store, persistor]
}

