
function rootReducer(state, action){
    switch (action.type){
        //Usuario
        case '@set/session':
            return {...state,jwt:action.payload.session}  
        case '@set/perfil':
            return {...state,perfil:action.payload.perfil}
        case '@init/perfil':
            return {...state,perfil:action.payload.perfil, mtr:{...state.mtr,perfil:action.payload.mt}}
        //Hato   
        case '@set/hato':
            return {...state,hato:action.payload.hato} 
        case '@set/bkpHato':
            return {...state,bkpHato:action.payload.hato} 
        case '@init/hato':
            return {...state,bkpHato:action.payload.hato,hato:action.payload.hato,mtr:{...state.mtr,hato:action.payload.mt}}
        //Vacunas
        case '@set/vacunas':
            return {...state,vacunas:action.payload.vacunas}
        case '@set/bkpVacunas':
            return {...state,bkpVacunas:action.payload.vacunas} 
        case '@init/vacunas':
            return {...state,bkpVacunas:action.payload.vacunas,vacunas:action.payload.vacunas,mtr:{...state.mtr,vacunas:action.payload.mt}}
        
        //Vacuna Animal
        case '@set/vac_animal':
            return {...state,vac_animal:action.payload.vac_animal, mtr:{...state.mtr,vac_animal:action.payload.mt}}

        //Sanitario
        case '@set/sanitarios':
            return {...state,sanitarios:action.payload.sanitarios}
        case '@set/bkpSanitarios':
            return {...state,bkpSanitarios:action.payload.sanitarios} 
        case '@init/sanitarios':
            return {...state,bkpSanitarios:action.payload.sanitarios,sanitarios:action.payload.sanitarios,mtr:{...state.mtr,sanitarios:action.payload.mt}}
        //Control Animal
        case '@set/ctl_animal':
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
            return {...state,ctl_animal:action.payload.ctl_animal, mtr:{...state.mtr,ctl_animal:action.payload.mt}}

        //Predios
        case '@set/predios':
            return {...state,predios:action.payload.predios}
        case '@set/bkpPredios':
            return {...state,bkpPredios:action.payload.predios} 
        case '@init/predios':
            return {...state,bkpPredios:action.payload.predios,predios:action.payload.predios,mtr:{...state.mtr,predios:action.payload.mt}}
        //Predio Animal
        case '@set/pre_animal':
            return {...state,pre_animal:action.payload.pre_animal, mtr:{...state.mtr,pre_animal:action.payload.mt}}
        //Pesajes
        case '@set/pesajes':
            return {...state,pesajes:action.payload.pesajes}
        case '@set/bkpPesajes':
            return {...state,bkpPesajes:action.payload.pesajes} 
        case '@init/pesajes':
            return {...state,bkpPesajes:action.payload.pesajes,pesajes:action.payload.pesajes,mtr:{...state.mtr,pesajes:action.payload.mt}}
            
        case '@create/animal':
            return {...state, animales:[...state.animales,action.payload]}
        case '@create/sanitario':
            return {...state, sanitario:[...state.sanitarios,action.payload]}
        case '@create/embarazo':
            return {...state, embarazos:[...state.embarazos,action.payload]}
        case '@create/peso':
            return {...state, pesos:[...state.pesos,action.payload]}
        case '@create/predio':
            return {...state, predios:[...state.predios, action.payload]}

        case '@error/hato':
            return {...state,errors:{...state.errors,hato:action.payload.msj}}
        default:
            return state;
    }
}
export default rootReducer;