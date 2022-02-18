
function rootReducer(state, action){
    switch (action.type){
        case '@set/session':
            return {...state,jwt:action.payload.session}  
        case '@set/perfil':
            return {...state,perfil:action.payload.perfil}
        case '@set/hato':
            return {...state,hato:action.payload.hato} 
        case '@set/bkpHato':
            return {...state,bkpHato:action.payload.hato} 
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
        case '@delete/session':
            return null;
        default:
            return state;
    }
}
export default rootReducer;