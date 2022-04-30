
const api = 'http://192.168.1.250/request/';

// Usuario
export const setSession = (token) =>{
    return {
        type: '@set/jwt',
        payload: {tkn:token}
    }
}
export const setPerfil = (perfil) =>{
    return {
        type: '@set/perfil',
        payload: {perfil:perfil}
    }
}
const initPerfil = (per,mtr) =>{
    return {
        type:'@init/perfil',
        payload: {perfil:per, mt: mtr}
    }
}
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
            if(responseTxt != false){
                dispatch(setSession(responseTxt));
                return true;
            }else
                return false;;
        }catch(error){
            console.log(error);
            return false;
        }
    }
}
export const getPerfil = (tkn) => {
    return async (dispatch) => {
        try{
            let [per,mt] = await Promise.all([
                fetch(api+'gPerfil.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ])
            const perfil = await per.json();
            const mtr = await mt.text();
            if(perfil!=false)
                dispatch(initPerfil(perfil,mtr));
            else
                dispatch(initPerfil(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

// Hato

export const setHato = (animals) => { 
    return {
        type: '@set/hato',
        payload: {hato:animals}
    }
}

const initHato = (animals,mtr = null) => {
    if(animals === true) 
        return {
            type: '@set/bkpHato',
            payload: {hato:animals}
        }
    else
        return{
            type: '@init/hato',
            payload: {hato:animals,mt:mtr}
        }
}

export const getHato = (tkn) => {
    return async (dispatch) => {
        try{
            let [animals,mt] = await Promise.all([
                fetch(api+'gHato.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ])
            const hato = await animals.json();
            const mtr = await mt.text();
            if(hato!=false)
                dispatch(initHato(hato,mtr)); 
            else
                dispatch(initHato(true,mtr)); //Hato vacio, solo se toma la marca temporal
        }catch(err) {
            return false;
        }
    }
}


// Vacunas
export const setVacunas = (vac) => { 
    return {
        type: '@set/vacunas',
        payload: {vacunas:vac}
    }
}
const initVacunas = (vac,mtr) => {
    if(vac === true) 
        return {
            type: '@set/bkpVacunas',
            payload: {vacunas:vac,mt:mtr}
        }
    else
        return{
            type: '@init/vacunas',
            payload: {vacunas:vac,mt:mtr}
        }
}
export const getVacunas = (tkn) => {
    return async (dispatch) => {
        try{
            let [vac,mt] = await Promise.all([
                fetch(api+'gVacunas.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ])
            const vacunas = await vac.json();
            const mtr = await mt.text();
            if(vacunas!=false)
                dispatch(initVacunas(vacunas,mtr));
            else
                dispatch(initVacunas(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }

}
// Vacunas Animales
export const setVacunaAnimal = (vac_ani,mtr) => {
    return {
        type: '@set/vacunaAnimal',
        payload: {vacuna_animal:vac_ani,mt:mtr}
    }
}

export const getVacunaAnimal = (tkn) => {
    return async (dispatch) => {
        try{
            let [vac_ani,mt] = await Promise.all([
                fetch(api+'gVacunaAnimal.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ])
            const vacuna_animal = await vac_ani.json();
            const mtr = await mt.text();
            if(vacuna_animal!=false)
                dispatch(setVacunaAnimal(vacuna_animal,mtr));
            else
                dispatch(setVacunaAnimal(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

// Controles sanitarios
export const setSanitarios = (controls) => {
    return {
        type: '@set/sanitarios',
        payload: {sanitarios:controls}
    }
}
const initSanitarios = (controls,mtr) => {
    if(controls === true) 
        return {
            type: '@set/bkpSanitarios',
            payload: {sanitarios:controls}
        }
    else
        return{
            type: '@init/sanitarios',
            payload: {sanitarios:controls,mt:mtr}
        }
}
export const getSanitarios = (tkn) => {
    return async (dispatch) => {
        try{
            let [ctls,mt] = await Promise.all([
                fetch(api+'gControls.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const sanitarios = await ctls.json();
            const mtr = await mt.text();
            if(sanitarios!=false)
                dispatch(initSanitarios(sanitarios,mtr));
            else
                dispatch(initSanitarios(true,mtr));
        }catch(error){
            return false;
        }
    }
}
//Ctl_Animal
export const setControlAnimal = (ctl_animal, mtr) => {
    return {
        type: '@set/ctlAnimal',
        payload: {ctl_animal:ctl_animal, mt:mtr}
    }
}
export const getControlAnimal = (tkn) => {
    return async (dispatch) => {
        try{
            let [ctl_ani,mt] = await Promise.all([
                fetch(api+'gControlAnimal.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ])
            const ctl_animal = await ctl_ani.json();
            const mtr = await mt.text();
            if(ctl_animal!=false)
                dispatch(setControlAnimal(ctl_animal,mtr));
            else
                dispatch(setControlAnimal(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

//Embarazos
export const setEmbarazos = (emb) => { 
    return {
        type: '@set/embarazos',
        payload: {embarazos:emb}
    }
}
const initEmbarazos = (emb,mtr) => {
    if(emb === true) 
        return {
            type: '@set/bkpEmbarazos',
            payload: {embarazos:emb}
        }
    else
        return{
            type: '@init/embarazos',
            payload: {embarazos:emb,mt:mtr}
        }
}
export const getEmbarazos = (tkn) => {
    return async (dispatch) => {
        try{
            let [emb,mt] = await Promise.all([
                fetch(api+'gEmbarazos.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const embarazos = await emb.json();
            const mtr = await mt.text();
            
            if(embarazos!=false)
                dispatch(initEmbarazos(embarazos,mtr));
            else
                dispatch(initEmbarazos(true,mtr));
            }catch(error){
                console.log(error);
                return false;
        }
    }
}
// Crias
export const setCrias = (cri,mtr) => {
    return {
        type: '@set/crias',
        payload: {crias:cri,mt:mtr}
    }
}
export const getCrias = (tkn) => {
    return async (dispatch) => {
        try{
            let [cri,mt] = await Promise.all([
                fetch(api+'gCrias.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const crias = await cri.json();
            const mtr = await mt.text();
            if(crias!=false)
                dispatch(setCrias(crias));
            else
                dispatch(setCrias(true));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

// Predios
export const setPredios = (pre) => { 
    return {
        type: '@set/predios',
        payload: {predios:pre}
    }
}
const initPredios = (pre,mtr) => {
    if(pre === true) 
        return {
            type: '@set/bkpPredios',
            payload: {predios:pre}
        }
    else
        return{
            type: '@init/predios',
            payload: {predios:pre,mt:mtr}
        }
}
export const getPredios = (tkn) => {
    return async (dispatch) => {
        try{
            let [pre,mt] = await Promise.all([
                fetch(api+'gPredios.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const predios = await pre.json();
            const mtr = await mt.text();
            if(predios!=false)
                dispatch(initPredios(predios,mtr));
            else
                dispatch(initPredios(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}
// Predio Animal
export const setPredioAnimal = (prd,mtr) => {
    return {
        type: '@set/predioAnimal',
        payload: {pre_animal:prd, mt:mtr}
    }
}
export const getPredioAnimal = (tkn) => {
    return async (dispatch) => {
        try{
            let [prd,mt] = await Promise.all([
                fetch(api+'gPredioAnimal.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const prd_animal = await prd.json();
            const mtr = await mt.text();
            if(prd_animal!=false)
                dispatch(setPredioAnimal(prd_animal,mtr));
            else
                dispatch(setPredioAnimal(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

// Pesajes
export const setPesajes = (pes) => {
    return {
        type: '@set/pesajes',
        payload: {pesajes:pes}
    }
}
const initPesajes = (pes,mtr) => {
    if(pes === true) 
        return {
            type: '@set/bkpPesajes',
            payload: {pesajes:pes}
        }
    else
        return{
            type: '@init/pesajes',
            payload: {pesajes:pes,mt:mtr}
        }
}
export const getPesajes = (tkn) => {
    return async (dispatch) => {
        try{
            let [pes,mt] = await Promise.all([
                fetch(api+'gPesajes.php',{
                    method: 'GET',
                    headers: {'Authorization':'Bearer '+tkn}
                }),
                fetch(api+'gMT.php')
            ]);
            const pesajes = await pes.json();
            const mtr = await mt.text();
            if(pesajes!=false)
                dispatch(initPesajes(pesajes,mtr));
            else
                dispatch(initPesajes(true,mtr));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

export const getRancho = (tkn) => {
    return async (dispatch) =>{
        try{
            dispatch(getHato(tkn));
            dispatch(getPerfil(tkn));
            dispatch(getEmbarazos(tkn));
            dispatch(getCrias(tkn));
            dispatch(getSanitarios(tkn))
            dispatch(getControlAnimal(tkn));
            dispatch(getPesajes(tkn));
            dispatch(getPredios(tkn));
            dispatch(getPredioAnimal(tkn));
            dispatch(getVacunas(tkn));
            dispatch(getVacunaAnimal(tkn));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}