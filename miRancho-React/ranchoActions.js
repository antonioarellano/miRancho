
const api = 'http://192.168.1.250/request/';

export const getSession = (usr, pass) => {
    return async (dispatch) => {
        try{
            var formData = new FormData();
            formData.append('u',usr);
            formData.append('p',pass);
            const response = await fetch(api+'gSession.php',
                {   
                    method: 'POST',
                    body: formData
                }
            );
            const responseTxt = await response.text();
            if(responseTxt != false)
                dispatch(setSession(responseTxt));
            else
                dispatch(setSession(false));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}
export const getPerfil = (tkn) => {
    return async dispatch => {
        const response = await fetch(api+'gPerfil.php',{
            method: 'GET',
            headers: 'Authorization: Bearer '+tkn
        });
        const perfil = await response.json();
        if(perfil != false)
                dispatch(setPerfil(perfil));
            else
                return;
    }
}
export const getHato = (tkn) => {
    return async (dispatch) => {
        try{
        const response = await fetch(api+'gHato.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        });
        const hato = await response.json();
        if(hato!=false)
            dispatch(setBkpHato(hato));
        else
            dispatch(setBkpHato(true));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}
export const searchAnimal = (search,hato) => {
    return async dispatch => {
        var result =  Array();
        for (const animal in hato) 
            if (animal.arete.includes(search)||animal.name.includes(search))
                result.push(animal);
        await dispatch(setHato(result));
    }
}
const setBkpHato = (animals) => {
    if(animals === true) 
        return {
            type: '@set/bkpHato',
            payload: {hato:animals}
        }
    else
        return{
            type: '@init/hato',
            payload: {hato:animals}
        }
}
export const setHato = (animals) => { 
    return {
        type: '@set/hato',
        payload: {hato:animals}
    }
}
const setSession = (session) =>{
    return {
        type: '@set/session',
        payload: {session:session}
    }
}
const setPerfil = (perfil) =>{
    return {
        type: '@set/perfil',
        payload: {perfil:perfil}
    }
}


const setControls = (controls) => {
    return {
        type: '@set/controls',
        payload: {controls:controls}
    }
}