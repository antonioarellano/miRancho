import NetInfo from "@react-native-community/netinfo";
const api = 'http://192.168.1.250/request/';

var perfil = [
    {type:'Usuario',data:'a'},
    {type:'Nombre',data:'n'},
    {type:'Contraseña',data:''},
    {type:'Dirección',data:'s'},
    {type:'Teléfono',data:0},
]

const getSession = async (usr,pass) => {
    const response = await fetch(api+'gSession.php',{
        method: 'POST',
        body: {u:usr, p:pass}
    });
    const responseTxt = await response.text();
    if (responseTxt!=null)
        return responseTxt;
    else
        return null;
}
const getPerfil = async (tkn) => {
    const response = await fetch(api+'gPerfil.php',{
        method: 'GET',
        headers: 'Authorization: Bearer '+tkn
    });
    return await response.json();
}

function rootReducer(state, action){
    switch (action.type){
        case '@get/session':
            return {...state, jwt:getSession(action.payload.user,action.payload.pass)}
        case '@get/perfil':
            return {...state, perfil:getPerfil(state.jwt)}
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