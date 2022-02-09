
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
        const perfil = await response.json();
        if(perfil != false)
                dispatch(setPerfil(perfil));
            else
                return;
    }
}
export const getHato = (tkn) => {
        fetch(api+'gHato.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        }).then(res => res.json()).then(txt => {
            console.log(txt);
            setHato(txt);
        }).catch(e => console.log(e))

    
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
const setHato = (animals) => { 
    return {
        type: '@set/hato',
        payload: {hato:animals}
    }
}
const setControls = (controls) => {
    return {
        type: '@set/controls',
        payload: {controls:controls}
    }
}