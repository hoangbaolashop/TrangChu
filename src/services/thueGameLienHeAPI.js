import axios from "../utils/axios-customize"

export const getOneThueGame = (query) => {
    const URL_BACKEND = `/api/lienhethuegame/get-thuegame?${query}`    
    return axios.get(URL_BACKEND)
}

export const createThueGame = (text) => {
    return axios.post('/api/lienhethuegame/create-thuegame', {
        text
    })
}

export const updateThueGame = (_id, text) => {
    return axios.put('/api/lienhethuegame/update-thuegame', {
        _id, text
    })
}

// -------------------------

export const getOneLienHe = (query) => {
    const URL_BACKEND = `/api/lienhethuegame/get-lienhe?${query}`    
    return axios.get(URL_BACKEND)
}

export const createLienHe = (text) => {
    return axios.post('/api/lienhethuegame/create-lienhe', {
        text
    })
}

export const updateLienHe = (_id, text) => {
    return axios.put('/api/lienhethuegame/update-lienhe', {
        _id, text
    })
}