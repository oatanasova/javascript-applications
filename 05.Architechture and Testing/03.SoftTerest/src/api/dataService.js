import { api } from "./requestor.js";

const endpoints = {
    getAll: 'http://localhost:3030/data/ideas?select=_id%2Ctitle%2Cimg&sortBy=_createdOn%20desc',
    create: 'http://localhost:3030/data/ideas',
    del: 'http://localhost:3030/data/ideas/',
    getById: 'http://localhost:3030/data/ideas/',
}

async function getAllIdea(){
    return await api.get(endpoints.getAll);
}

async function createIdea(data){
    return await api.post(endpoints.create, data);
}

async function getIdeaById(id){
    return await api.get(endpoints.getById + id);
}

async function deleteIdea(id){
    return await api.del(endpoints.del + id);
}


export const dataService = {
    getAllIdea,
    createIdea,
    getIdeaById,
    deleteIdea
}