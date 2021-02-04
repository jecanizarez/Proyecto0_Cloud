import axios from "axios";
import Cookie from "js-cookie";

const url = "http://127.0.0.1:5000/login"

export async function post_login(data){
   axios.post(url,data).then((datar) => {
       Cookie.set("access_token",datar.data.access_token);
   });
}
export async function post_register(data){
    axios.post("http://127.0.0.1:5000/usuarios",data).then(() => {
        console.log("registrado");
    });
 }