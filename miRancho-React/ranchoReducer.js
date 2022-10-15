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
    mtr:{hato:0,sanitarios:0,ctl_animal:0,crias:0,embarazos:0,pesajes:0,predios:0,predio_animal:0,perfil:0,vacunas:0,vac_animal:0}, 
    local:{sanitarios:0,predios:0,vacunas:0}
  }

function rootReducer(state, action){
    switch (action.type){
        //Usuario
        case '@set/jwt':
            return {...state,jwt:action.payload.tkn};
        case '@set/perfil':
            return {...state,perfil:action.payload.perfil};
        case '@init/perfil':
            return {...state,perfil:action.payload.perfil, mtr:{...state.mtr,perfil:action.payload.mt}};
        case '@close/session':
            return{initialState}
            //Hato   
        case '@set/hato':
            return {...state,hato:action.payload.hato}; 
        case '@set/bkpHato':
            return {...state,bkpHato:action.payload.hato};
        case '@init/hato':
            return {...state,bkpHato:action.payload.hato,hato:action.payload.hato,mtr:{...state.mtr,hato:action.payload.mt}};
        //Vacunas
        case '@set/vacunas':
            return {...state,vacunas:action.payload.vacunas};
            break;
        case '@set/bkpVacunas':
            return {...state,bkpVacunas:action.payload.vacunas};
        case '@init/vacunas':
            return {...state,bkpVacunas:action.payload.vacunas,vacunas:action.payload.vacunas,mtr:{...state.mtr,vacunas:action.payload.mt}};
        //Vacuna Animal
        case '@set/vacunaAnimal':
            return {...state,vac_animal:action.payload.vacuna_animal, mtr:{...state.mtr,vac_animal:action.payload.mt}};

        //Sanitario
        case '@set/sanitarios':
            return {...state,sanitarios:action.payload.sanitarios}
        case '@set/bkpSanitarios':
            return {...state,bkpSanitarios:action.payload.sanitarios} 
        case '@init/sanitarios':
            return {...state,bkpSanitarios:action.payload.sanitarios,sanitarios:action.payload.sanitarios,mtr:{...state.mtr,sanitarios:action.payload.mt}}
        //Control Animal
        case '@set/ctlAnimal':
            return {...state,ctl_animal:action.payload.ctl_animal, mtr:{...state.mtr,ctl_animal:action.payload.mt}}
        
        //Embarazos
        case '@set/embarazos':
            return {...state,embarazos:action.payload.embarazos}
        case '@set/bkpEmbarazos':
            return {...state,bkpEmbarazos:action.payload.embarazos} 
        case '@init/embarazos':
            return {...state,bkpEmbarazos:action.payload.embarazos,embarazos:action.payload.embarazos,mtr:{...state.mtr,embarazos:action.payload.mt}}
        
            //Crias
        case '@set/crias':
            return {...state,crias:action.payload.crias, mtr:{...state.mtr,crias:action.payload.mt}}

        //Predios
        case '@set/predios':
            return {...state,predios:action.payload.predios}
        case '@set/bkpPredios':
            return {...state,bkpPredios:action.payload.predios} 
        case '@init/predios':
            return {...state,bkpPredios:action.payload.predios,predios:action.payload.predios,mtr:{...state.mtr,predios:action.payload.mt}}
        //Predio Animal
        case '@set/predioAnimal':
            return {...state,pre_animal:action.payload.pre_animal, mtr:{...state.mtr,pre_animal:action.payload.mt}}
        //Pesajes
        case '@set/pesajes':
            return {...state,pesajes:action.payload.pesajes}
        case '@set/bkpPesajes':
            return {...state,bkpPesajes:action.payload.pesajes} 
        case '@init/pesajes':
            return {...state,bkpPesajes:action.payload.pesajes,pesajes:action.payload.pesajes,mtr:{...state.mtr,pesajes:action.payload.mt}}
        //Transacciones
        case '@add/trans':
            return {...state,trans:[...state.trans,action.payload.tran]}
        case '@flush/trans':
            return {...state,trans:[]}
        ///////////////////////
        //Agregar localmente
        /////////////////////
        case '@add/animal':
            return {...state, hato:[...state.hato,action.payload]}
        case '@add/cria':
            return {...state, crias:[...state.crias, action.payload]}
        case '@add/sanitario':
            const san = state.local.sanitario - 1;
            const nSan = Object.assign(state.payload,{id:san});
            return {...state, sanitarios:[...state.sanitarios,nSan], local:{...state.local,sanitarios:san}}
        case '@add/embarazo':
            return {...state, embarazos:[...state.embarazos,action.payload]}
        case '@add/pesaje':
            return {...state, pesajes:[...state.pesajes,action.payload]}
        case '@add/vacuna':
            const vac = state.local.vacunas - 1;
            const nVac = Object.assign(state.payload,{id:san});
            return {...state, vacunas:[...state.vacunas,nVac], local:{...state.local,vacunas:vac}};
        case '@add/predio':
            const pre = state.local.predios - 1;
            const nPre = Object.assign(state.payload,{id:pre});
            return {...state, predios:[...state.predios,nPre], local:{...state.local,predios:pre}};

        case '@add/vacAnimal':
            return {...state, vac_animal:[...state.vac_animal,action.payload]}
        case '@add/sanAnimal':
            return {...state, ctl_animal:[...state.ctl_animal,action.payload]}
        case '@add/preAnimal':
            return {...state, predio_animal:[...state.pre_animal,action.payload]}
        ////////////////////////////
            //Eliminar localmente //
        ///////////////////////////
        case '@drop/animal':
            const nHato = state.hato.filter(animal =>{
                if(animal.arete != action.payload)
                    return true;
            });
            const nAnimal_Vac = state.vac_animal.filter(rel =>{
                if(rel.arete != action.payload)
                    return true;
            });
            const nAnimal_San = state.ctl_animal.filter(rel =>{
                if(rel.arete != action.payload)
                    return true;
            });
            const nAnimal_Pre = state.predio_animal.filter(rel =>{
                if(rel.arete != action.payload)
                    return true;
            });
            return {...state, hato:nHato,vac_animal:nAnimal_Vac,ctl_animal:nAnimal_San,predio_animal:nAnimal_Pre}
        case '@drop/vacuna':
            const nVacunas = state.vacunas.filter(vacuna =>{
                if(vacuna.id != action.payload)
                    return true;
            });
            const nVac_Animal = state.vac_animal.filter(rel =>{
                if(rel.vacuna != action.payload)
                    return true;
            });
            return {...state, vacunas:nVacunas, vac_animal:nVac_Animal}
        case '@drop/sanitario':
            const nSanitarios= state.sanitarios.filter(sanitario =>{
                if(sanitario.id != action.payload)
                    return true;
            });
            const nCtl_Animal = state.ctl_animal.filter(rel =>{
                if(rel.ctl != action.payload)
                    return true;
            });
            return {...state, sanitarios:nSanitarios, ctl_animal:nCtl_Animal}
        case '@drop/embarazo':
            return {...state, embarazos:[...state.embarazos,action.payload]}
        case '@drop/pesaje':
            const nPesajes= state.pesajes.filter(pesaje =>{
                if(pesaje.id != action.payload)
                    return true;
            });
            return {...state, pesajes:nPesajes}
        case '@drop/predio':
            const nPredios= state.predios.filter(predio =>{
                if(predio.id != action.payload)
                    return true;
            });
            const nPre_Animal = state.pre_animal.filter(rel =>{
                if(rel.predio != action.payload)
                    return true;
            });
            return {...state, predios:nPredios, pre_animal:nPre_Animal}

        case '@error/hato':
            return {...state,errors:{...state.errors,hato:action.payload.msj}}
        default:
            return state;
    }
}
export default rootReducer;