import axios from 'axios';
import Cookie from 'js-cookie';

const url = "http://172.24.98.90/eventos"

export async function get_Events(){
    axios.defaults.headers.common['Authorization'] = 
                                'Bearer ' + Cookie.get("access_token");
    let respuesta = await axios.get(url); 
    return respuesta.data; 
} 

export async function put_Events(data){
    axios.defaults.headers.common['Authorization'] = 
                                'Bearer ' + Cookie.get("access_token");
    let respuesta = await axios.put(url+'/'+data.id, data); 
    return respuesta.data; 
} 
export async function delete_Events(data){
    axios.defaults.headers.common['Authorization'] = 
                                'Bearer ' + Cookie.get("access_token");
    let respuesta = await axios.delete(url+'/'+data); 
    return respuesta.data; 
} 
export async function create_Event(data){
    axios.defaults.headers.common['Authorization'] = 
                                'Bearer ' + Cookie.get("access_token");
    let respuesta = await axios.post(url,data); 
    return respuesta.data; 
} 
