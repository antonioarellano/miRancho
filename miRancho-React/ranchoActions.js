
const api = 'http://192.168.100.99/request/';


//////////////
// Usuario///
/////////////
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
export const updatePerfil = async (tkn,update) => {
    try {
        var formData = new FormData();
        formData.append('type',update.type);
        formData.append('word',update.word);
        const response = await fetch(
            api+'uPerfil.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}

///////////
// Hato////
///////////
export const createAnimal = async (tkn,data) => {
    try {
        var formData = new FormData();
        formData.append('arete',data.arete);
        formData.append('name',data.name);
        formData.append('sex',data.sex);
        formData.append('nac',data.nac);
        formData.append('race',data.race);
        formData.append('color',data.color);
        const response = await fetch(
            api+'cAnimal.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const deleteAnimal = async (tkn,arete) => {
    try {
        var formData = new FormData();
        formData.append('arete',arete);
        const response = await fetch(
            api+'dAnimal.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const updateAnimal = async (tkn,arete,type,word) => {
    try {
        var formData = new FormData();
        formData.append('arete',arete);
        formData.append('type',type);
        formData.append('word',word);
        const response = await fetch(
            api+'uAnimal.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
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

export const addAnimal = (animal) => {
    return{
        type:'@add/animal',
        payload:animal
    }
}
export const dropAnimal = (arete) => {
    return{
        type:'@drop/animal',
        payload:arete
    }
}
/////////////////
// Vacunas///
///////////////
export const createVacuna = async (tkn,data) => {
    try {
        var formData = new FormData();
        formData.append('name',data.name);
        formData.append('fecha',data.fecha);
        const response = await fetch(
            api+'cVacuna.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const deleteVacuna = async (tkn,vacuna) => {
    try {
        var formData = new FormData();
        formData.append('id',vacuna);
        const response = await fetch(
            api+'dVacuna.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const updateVacuna = async (tkn,vacuna,type,word) => {
    try {
        var formData = new FormData();
        formData.append('id',vacuna);
        formData.append('type',type);
        formData.append('word',word);
        const response = await fetch(
            api+'uVacuna.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
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
export const addVacuna = (vacuna) => {
    return{
        type:'@add/vacuna',
        payload:vacuna
    }
}
export const dropVacuna = (id) => {
    return{
        type:'@drop/vacuna',
        payload:id
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
//////////////////////////
// Controles sanitarios //
/////////////////////////
export const createSanitario = async (tkn,data) => {
    try {
        var formData = new FormData();
        formData.append('name',data.name);
        formData.append('fecha',data.fecha);
        const response = await fetch(
            api+'cSanitario.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const deleteSanitario = async (tkn,sanitario) => {
    try {
        var formData = new FormData();
        formData.append('id',sanitario);
        const response = await fetch(
            api+'dSanitario.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const updateSanitario = async (tkn,sanitario,type,word) => {
    try {
        var formData = new FormData();
        formData.append('id',sanitario);
        formData.append('type',type);
        formData.append('word',word);
        const response = await fetch(
            api+'uSanitario.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
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
export const addSanitario = (sanitario) => {
    return{
        type:'@add/sanitario',
        payload:sanitario
    }
}
export const dropSanitario = (id) => {
    return{
        type:'@drop/sanitario',
        payload:id
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
export const createPredio = async (tkn,data) => {
    try {
        var formData = new FormData();
        formData.append('name',data.name);
        formData.append('agua',data.agua);
        formData.append('pasto',data.pasto);
        const response = await fetch(
            api+'cPredio.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const deletePredio = async (tkn,predio) => {
    try {
        var formData = new FormData();
        formData.append('id',predio);
        const response = await fetch(
            api+'dPredio.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const updatePredio = async (tkn,predio,type,word) => {
    try {
        var formData = new FormData();
        formData.append('id',predio);
        formData.append('type',type);
        formData.append('word',word);
        const response = await fetch(
            api+'uPredio.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
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
export const createPesaje = async (tkn,data) => {
    try {
        var formData = new FormData();
        formData.append('arete',data.arete);
        formData.append('peso',data.kg.toString());
        formData.append('fecha',data.fecha);

        const response = await fetch(
            api+'cPesaje.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        console.log(msj);
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const deletePesaje = async (tkn,pesaje) => {
    try {
        var formData = new FormData();
        formData.append('id',pesaje);
        const response = await fetch(
            api+'dPesaje.php', 
            {
                method: 'POST',
                headers: {'Authorization':'Bearer '+tkn},
                body: formData
            }
        );
        const msj = await response.text();
        if (parseInt(msj) > 0){
            return true;
        }else{
            return false;
        }
                
    } catch (error) {
        console.log('falta',error);
        return false;
    }
}
export const addPesaje = (pesaje) => {
    return{
        type:'@add/pesaje',
        payload:pesaje
    }
}
export const dropPesaje = (id) => {
    return{
        type:'@drop/pesaje',
        payload:id
    }
}
// Transacciones
export const addTrans = (trans) => {
    return {
        type:'@add/trans',
        payload:{tran:trans}
    }
}
export const flushTrans = () => {
    return{
        type:'@flush/trans'
    }
}
export const processTrans = async (tkn,trans,mtr) =>{
    try{    
        const mtw = await getTimeStamp();
        var reject = 0;
        await trans.forEach((tran) =>{
            switch(tran.type){
                case 'addAnimal':
                    if(new Date(mtr.hato).getTime < new Date(mtw.hato).getTime)
                        reject = + 1;
                    else{
                        var ins = createAnimal(tkn,tran.data);
                        if(!ins)
                            reject = + 1;
                    }
                    break;
                case 'delAnimal':
                    if(new Date(mtr.hato).getTime < new Date(mtw.hato).getTime)
                        reject = + 1;
                    else{
                        var ins = deleteAnimal(tkn,tran.data);
                        if(!ins)
                            reject = + 1;
                    }
                    break;
                default:
                    break;
            }
        });
        return reject
    }catch(error){
        console.log('err',error);
        return false;
    }
}

// Sincronizacion
const getTimeStamp = async(tkn) =>{
    try{
        let res = await fetch(api+'gMTW.php',{
                method: 'GET',
                headers: {'Authorization':'Bearer '+tkn}
                })
        
        const mtw = await res.json();
        if(mtw!=false)
            return mtw
        else
            return false
    }catch(error){
        console.log('err',error);
        return false;
    }
}
export const getRancho = (tkn,mtr) => {
    return async (dispatch) =>{
        try{
            var mtw = await getTimeStamp(tkn);

            if(mtr.hato == undefined || new Date(mtr.hato).getTime <= new Date(mtw.hato).getTime)
                await dispatch(getHato(tkn));
            if(mtr.perfil == undefined || new Date(mtr.perfil).getTime <= new Date(mtw.perfil).getTime)
                await dispatch(getPerfil(tkn));
            if(mtr.embarazos == undefined || new Date(mtr.embarazos).getTime < new Date(mtw.embarazos).getTime)
                await dispatch(getEmbarazos(tkn));
            if(mtr.crias == undefined || new Date(mtr.crias).getTime < new Date(mtw.crias).getTime)
                await dispatch(getCrias(tkn));
            if(mtr.sanitarios == undefined || new Date(mtr.sanitarios).getTime < new Date(mtw.sanitarios).getTime)
                await dispatch(getSanitarios(tkn));
            if(mtr.ctl_animal == undefined || new Date(mtr.ctl_animal).getTime < new Date(mtw.ctl_animal).getTime)
                await dispatch(getControlAnimal(tkn));
            if(mtr.pesajes == undefined || new Date(mtr.pesajes).getTime < new Date(mtw.pesajes).getTime)
                await dispatch(getPesajes(tkn));
            if(mtr.predios == undefined || new Date(mtr.predios).getTime < new Date(mtw.predios).getTime)
                await dispatch(getPredios(tkn));
            if(mtr.predio_animal == undefined || new Date(mtr.predio_animal).getTime < new Date(mtw.predio_animal).getTime)
                await dispatch(getPredioAnimal(tkn));
            if(mtr.vacunas == undefined || new Date(mtr.vacunas).getTime < new Date(mtw.vacunas).getTime)
                await dispatch(getVacunas(tkn));
            if(mtr.vac_animal == undefined || new Date(mtr.vac_animal).getTime < new Date(mtw.vac_animal).getTime)
                await dispatch(getVacunaAnimal(tkn));
        }catch(error){
            console.log(error);
            return false;
        }
    }
}