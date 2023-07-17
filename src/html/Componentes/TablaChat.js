// import "../../css/styleLogin.css"
// import React, { useState, useEffect } from 'react';
// import DataTable from 'react-data-table-component';
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { getToken, removeUserSession, setUserSession } from './Common';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import * as XLSX from "xlsx";
// import DotLoader from "react-spinners/DotLoader";

// function TablaChat({ flujo }) {

//     const [datafull, setData] = useState([]);
//     const [authLoading, setAuthLoading] = useState(true);
//     const navigate = useNavigate();
//     const sesiones = {
//         sgui: localStorage.getItem("localgui"),
//         scliente: localStorage.getItem("localcliente"),
//         sid: localStorage.getItem("localid"),
//         sid_usuario: localStorage.getItem("localid_usuario"),
//         stoken: localStorage.getItem("token")
//     };


//     useEffect(() => {

//         const token = getToken();
//         const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"
//         if (!token) {
//             // console.log('Vacio')
//             navigate(rutaservidor);
//             return;
//         }


//         axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
//             .then(response => {

//                 setUserSession(sesiones.sgui, sesiones.sid_usuario);
//                 setAuthLoading(true);


//             }).catch(error => {
//                 removeUserSession();
//                 setAuthLoading(true);
//             });

//         Datos()

//     }, []);

//     const Datos = (async () => {


//         const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado',
//             { dato: flujo },
//             { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

//         if (result.status === 200) {

//             console.log(result.data)
//             setData(result.data);
           
//         }
// // else{
// //     setLoading(false)
// // }
//     })


//     const customStyles = {
//         rows: {
//             style: {
//                 minHeight: '50px', // override the row height
//                 maxHeight: '60px',
//                 border: '2px solid #a9dff0',
//                 borderRadius: '3px'
//             },
//         },
//         headCells: {
//             style: {
//                 paddingLeft: '8px', // override the cell padding for head cells
//                 paddingRight: '8px',
//                 backgroundColor: '#a9dff0',

//             },
//         },
//         cells: {
//             style: {
//                 paddingLeft: '8px', // override the cell padding for data cells
//                 paddingRight: '8px',
//                 fontSize: '20px',


//             },
//         },
//     };

//     const columns1 = [
//         {
//             name: <div className="text-wrap">ChatBot T</div>,
//             selector: row => row.fecha,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Agente Chat T</div>,
//             selector: row => row.recibidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">ChatBot U</div>,
//             selector: row => row.atendidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Agente Chat U</div>,
//             selector: row => row.recibidas - row.atendidas, //aqui
//             center: true
//         }
//     ];
//     const columns = [
//         {
//             name: <div className="text-wrap">Disponible</div>,
//             selector: row => row.fecha,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Ocupado</div>,
//             selector: row => row.recibidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">tiempo Admin</div>,
//             selector: row => row.atendidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">No Disponible</div>,
//             selector: row => row.recibidas - row.atendidas, //aqui
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Total</div>,
//             selector: row => row.recibidas - row.atendidas, //aqui
//             center: true
//         }
//     ];
//     const columnsfull = [
//         {
//             name: <div className="text-wrap">Puesto</div>,
//             selector: row => row.fecha,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Agente</div>,
//             selector: row => row.recibidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Estado</div>,
//             selector: row => row.atendidas,
//             center: true
//         },
//         {
//             name: <div className="text-wrap">Tiempo</div>,
//             selector: row => row.recibidas - row.atendidas, //aqui
//             center: true
//         }
//     ];

//     return (
//         <>

//             {loading ? (
//                 <div className="d-flex justify-content-center mt-3">
//                     <DotLoader
//                         className='loading'
//                         color={'#5b198ab5'}
//                         loading={loading}
//                         size={60}
//                         aria-label="Loading Spinner"
//                         data-testid="loader"
//                     />
//                 </div>

//             ) : (
//                 <div className="row">
//                     <div className="col-6">
//                 <DataTable
//                     className="mb-3"
//                     columns={columns1}
//                     data={datafull}
//                     // highlightOnHover
//                     customStyles={customStyles}/>
               
//                 <DataTable
//                     className="mb-3"
//                     columns={columns}
//                     // data={datafull}
//                     // highlightOnHover
//                     customStyles={customStyles}/>
               
//                 <DataTable
//                     className="mb-3"
//                     columns={columnsfull}
//                     data={datafull}
//                     // highlightOnHover
//                     customStyles={customStyles}/>
//                </div>

//                 </div>
//             )}
//         </>
//     )
// }
// export default TablaChat