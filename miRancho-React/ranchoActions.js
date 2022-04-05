
const api = 'http://192.168.1.250/request/';




// Usuario
const setSession = (session) =>{
    return {
        type: '@set/session',
        payload: {session:session}
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
export const setVacunaAnimal = (vac) => {
    return {
        type: '@set/vacunaAnimal',
        payload: {vacuna_animal:vac}
    }
}

export const getVacunaAnimal = (tkn) => {
    return async (dispatch) => {
        try{
        const response = await fetch(api+'gVacunaAnimal.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        });
        const vacuna_animal = await response.json();
        if(vacuna_animal!=false)
            dispatch(setBkpVacunaAnimal(vacuna_animal));
        else
            dispatch(setBkpVacunaAnimal(true));
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
export const setControlAnimal = (ctl) => {
    return {
        type: '@set/ctlAnimal',
        payload: {ctl_animal:ctl}
    }
}
export const getControlAnimal = (tkn) => {
    return async (dispatch) => {
        try{
        const response = await fetch(api+'gControlAnimal.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        });
        const ctl_animal = await response.json();
        if(ctl_animal!=false)
            dispatch(setBkpControlAnimal(ctl_animal));
        else
            dispatch(setBkpControlAnimal(true));
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
export const setCrias = (cri) => {
    return {
        type: '@set/crias',
        payload: {crias:cri}
    }
}
export const getCrias = (tkn) => {
    return async (dispatch) => {
        try{
        const response = await fetch(api+'gCrias.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        });
        const crias = await response.json();
        if(crias!=false)
            dispatch(setBkpCrias(crias));
        else
            dispatch(setBkpCrias(true));
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
export const setPredioAnimal = (pre) => {
    return {
        type: '@set/predioAnimal',
        payload: {predio_animal:pre}
    }
}
export const getPredioAnimal = (tkn) => {
    return async (dispatch) => {
        try{
        const response = await fetch(api+'gPredioAnimal.php',{
            method: 'GET',
            headers: {'Authorization':'Bearer '+tkn}
        });
        const prd_animal = await response.json();
        if(prd_animal!=false)
            dispatch(setBkpPredioAnimal(prd_animal));
        else
            dispatch(setBkpPredioAnimal(true));
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
            console.log(pesajes);
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
