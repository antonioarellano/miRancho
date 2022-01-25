var perfil = [
    {type:'Usuario',data:'a'},
    {type:'Nombre',data:'n'},
    {type:'Contraseña',data:''},
    {type:'Dirección',data:'s'},
    {type:'Teléfono',data:0},
]
const state = {
    user: [
        {type:'Usuario',data:'a'},
        {type:'Nombre',data:'n'},
        {type:'Contraseña',data:''},
        {type:'Dirección',data:'s'},
        {type:'Teléfono',data:0},
    ],
    animales: [],
    sanitarios: [],
    embarazos = [],
    predios = []
}
const createUser = async (newUser) => {
    try {
        const response = await fetch(
            'https://turancho.com.mx/request/cUser.php', 
            {
                method: 'POST',
                body: JSON.stringify(
                    {u:newUser.user}
                )
            }
        );
        const json = await response.json();
        return json.movies;
    } catch (error) {
        return false;
    }
};

export const ranchoReducer = (state, action) => {
    switch (action.type){
        case '@get/usuario':
             
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
        case '@create/usuario':
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    if (createUser(action.payload)){
                        return {...state, user:}
                    }else
                        return state;
                }else{
                    return state;
                }
            
        case '@update/username':
            
            const {perfil} = action.payload
            return {...state, usuario:[...state.usuario, action.payload]}
        default:
            break;
    }
}


export const createAnimal = (animal) =>{
 
}