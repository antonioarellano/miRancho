import { createStore, applyMiddleware } from 'redux';
import rootReducer from './ranchoReducer';
import thunk from 'redux-thunk';

// const persistConfig = {key: 'toor',storage: AsyncStorage,}

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
  errors: {hato:null,},
  mtr:{hato:null,sanitarios:null,ctl_animal:null,crias:null,embarazos:null,pesajes:null,predios:null,predio_animal:null,perfil:null,vacunas:null,vac_animal:null} 
}
// const persistedReducer = persistReducer(persistConfig, ranchoReducer); 
// let persistor = persistStore(ranchoStore);
export default function Store(){
    return createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk)
    );
}

