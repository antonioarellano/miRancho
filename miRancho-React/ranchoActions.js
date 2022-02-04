

export function getSession(usr, pas){
        return {
            type: '@get/session',
            payload: {user: usr, pass: pas}
        }
    }
    const getPerfil = () => {
        return {
            type: '@get/perfil'
        }
    }
    const getHato = () => {
        return {
            type: '@get/animals'
        }
    }
    const getControls = () => {
        return {
            type: '@get/controls'
        }
    }