
const api = 'http://192.168.1.250/request/';

export const getSession = (usr, pass) => {
    return async dispatch => {
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
        return await response.json();
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
const setHato = () => { 
    return {
        type: '@get/animals'
    }
}
const getControls = () => {
    return {
        type: '@get/controls'
    }
}