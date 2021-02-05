import axios from "axios";
import Cookie from "js-cookie";

const url = "http://172.24.98.90/login"

export async function post_login(data){
   axios.post(url,data).then((datar) => {
       Cookie.set("access_token",datar.data.access_token);
   });
}
export async function post_register(data){
    axios.post("http://172.24.98.90/usuarios",data).then(() => {
        console.log("registrado");
    });
 }