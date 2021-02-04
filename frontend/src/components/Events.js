import React, {useState, useEffect } from 'react'; 
import {get_Events, put_Events, delete_Events,create_Event} from '../services/Events'; 
import { AiFillEdit,AiFillDelete, AiFillPlusCircle} from "react-icons/ai";
import DatePicker from "react-datepicker";
import Modal from "react-bootstrap/Modal";
import '../css/EventsCss.css';



export default function Events(){
    const [events,setEvents] = useState([]);
    const[showEditModal, setShowEditModal] = useState(false);
    const[showCreateModal,setShowCreateModal ] = useState(false);
    const[showDetail,setShowDetail ] = useState(false);
    const[eventSelected, setEvent] = useState([]);
    const[nombre, setNombre] = useState();
    const[categoria, setCategoria] = useState();
    const[lugar, setLugar] = useState();
    const[direccion, setDireccion] = useState();
    const[presencial, setPresencial] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());


    useEffect(async () => {
      fetchEvents()
        
    }, [])
    async function fetchEvents(){
      let data = await get_Events(); 
        console.log(data);
        setEvents(data);
        console.log(events);
    }
    async function createEvent(){
      let new_event  = new Object(); 
      new_event.id = eventSelected.id
      new_event.nombre = nombre; 
      new_event.categoria = categoria; 
      new_event.lugar = lugar; 
      new_event.direccion = direccion; 
      new_event.presencial =presencial;
      new_event.fechaInicio = startDate.getFullYear()+"-"+ startDate.getMonth()+"-"+ startDate.getDate();
      new_event.fechaFin = endDate.getFullYear()+"-"+ endDate.getMonth()+"-"+ endDate.getDate();
      await create_Event(new_event); 
      fetchEvents()
      setShowCreateModal(false); 
    }
    async function editEvent(){
      let new_event  = new Object(); 
      new_event.id = eventSelected.id
      new_event.nombre = nombre; 
      new_event.categoria = categoria; 
      new_event.lugar = lugar; 
      new_event.direccion = direccion; 
      new_event.presencial =presencial;
      new_event.fechaInicio = startDate.getFullYear()+"-"+ startDate.getMonth()+"-"+ startDate.getDate();
      new_event.fechaFin = endDate.getFullYear()+"-"+ endDate.getMonth()+"-"+ endDate.getDate();
      console.log(new_event); 
      await put_Events(new_event);
      fetchEvents()
      setShowEditModal(false); 
    }
    async function deleteEvent(id){
      console.log(id);
      await delete_Events(id); 
      fetchEvents()
    }

    return(
    <div>
      <div className="container-fluid contenedor">
        <div className="row justify-content-center contenedor">
          <div className="col-auto contenedor">
          <button className="btn btn-danger" onClick={() => setShowCreateModal(true)}> Crear evento</button>
          </div>
        </div>
      </div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">nombre</th>
              <th scope="col">categoria</th>
              <th scope="col">lugar</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              
            </tr>
          </thead>

           <tbody>
               {events.map((d) =>(<tr key={d.id} >
               <td onClick={() =>
                {setEvent(d);
                  setShowDetail(true)}}>{d.nombre}</td>
               <td>{d.categoria}</td>
               <td>{d.lugar}</td>
               <td><button className="btn btn-danger " type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() =>{
                   deleteEvent(d.id);
               }}
              ><AiFillDelete/></button>
                </td>
               <td><button className="btn btn-success" onClick={() =>{
                   setEvent(d); 
                   setShowEditModal(true);
               }}> <AiFillEdit/></button> </td>
               <td><button className="btn btn-success" onClick={() =>{
                   setEvent(d); 
                   setShowDetail(true);
               }}> <AiFillPlusCircle/></button> </td>
               </tr>))}
               
          </tbody>
        </table>
        <Modal show={showEditModal} idEvent={eventSelected}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addProductModalLabel">
                    Editar un evento
              </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlfor="inputName">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        placeholder = {eventSelected.nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputType">Categoria</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputQuantity">Lugar</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.lugar}
                        onChange={(e) => setLugar(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Direccion</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Inicial</label>
                      <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Final</label>
                      <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Presencial</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.presencial}
                        onChange={(e) => setPresencial(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
              </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => editEvent()}
                  >
                    Editar Evento
              </button>
                </div>
              </div>
            </Modal>
            <Modal show={showCreateModal} idEvent={eventSelected}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addProductModalLabel">
                    Crear un evento
              </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlfor="inputName">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputType">Categoria</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setCategoria(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputQuantity">Lugar</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setLugar(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Direccion</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Inicial</label>
                      <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Final</label>
                      <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Presencial</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setPresencial(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
              </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => createEvent()}
                  >
                    Crear Evento
              </button>
                </div>
              </div>
            </Modal>
            <Modal show={showEditModal}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addProductModalLabel">
                    Editar un evento
              </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlfor="inputName">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        placeholder = {eventSelected.nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputType">Categoria</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputQuantity">Lugar</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.lugar}
                        onChange={(e) => setLugar(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Direccion</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Inicial</label>
                      <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Fecha Final</label>
                      <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="yyyy/MM/dd h:mm aa" />
                    </div>
                    <div className="form-group">
                      <label htmlfor="inputPrice">Presencial</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder = {eventSelected.presencial}
                        onChange={(e) => setPresencial(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
              </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => editEvent()}
                  >
                    Editar Evento
              </button>
                </div>
              </div>
            </Modal>
            <Modal show={showDetail}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {eventSelected.nombre}
              </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowDetail(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                    <p>Categoria:{eventSelected.categoria}</p>
                    <p>Lugar:{eventSelected.lugar}</p>
                    <p>Direccion:{eventSelected.direccion}</p>
                    <p>Fecha Inicio:{eventSelected.fechaInicio}</p>
                    <p>Fecha Final:{eventSelected.fechaFinal}</p>
                    <p>Presencial:{eventSelected.presencial+""}</p>
                </div>
                <div className="modal-footer">
                </div>
              </div>
            </Modal>

      </div>
    )
}