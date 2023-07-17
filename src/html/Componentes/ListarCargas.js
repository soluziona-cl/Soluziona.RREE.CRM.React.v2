import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import DotLoader from "react-spinners/DotLoader";
import { ToastContainer, toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import { format } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es'

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";



function ListarCargas({ company }) {
    const [data, setData] = useState([]);
    const [excel, setExcel] = useState()
    const [authLoading, setAuthLoading] = useState(true);
    const [list_id, setListId] = useState('');
    const [resultante, setResultante] = useState('');
    const [startdateini, setStartDateIni] = useState(new Date());
    const [startdatefin, setStartDateFin] = useState(new Date());
    //modal
    const [mostrarModal, setMostrarModal] = useState(false)
    const [mostrarModal2, setMostrarModal2] = useState(false)
    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };
    const years = range(2022, getYear(new Date()) + 2, 1);
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const handleOnCerrar = () => {
        setMostrarModal(false)
        // setListId('')
    }
    const handleOnCerrar2 = () => {
        setMostrarModal2(false)
        setListId('')
        setResultante('')
    }

    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false)
    const [modalCarga, setDataModalCarga] = useState('');

    // const abrirModal = event =>{
    //     setMostrarModal(true)
    //     console.log("abrir modal")
    // }

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const token = getToken();
        const rutaservidor = "/Orkesta/Procollect/CRM"
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(false);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(false);
            });

        Buscar()
        // componentDidMount()

    }, []);




    // 
    const componentDidMount = () => {
        if (!$.fn.DataTable.isDataTable("#tbl_acumulado_dia")) {
            $(document).ready(function () {
                setTimeout(function () {
                    $("#tbl_acumulado_dia").DataTable({
                        destroy: true,
                        language: {
                            url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-cl.json"
                        },
                        paging: true,
                        pageLength: 10,
                        scrollX: true,
                        sScrollXInner: "100%",
                        dom: "frtip"

                    });
                }, 2000);
            });
        }
    }

    const Buscar = (async () => {



        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DetalleGestion/Mes', { dato: null }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)
            setData(result.data);
        }


    })


    if (authLoading && getToken()) {
        return <div className="content">Checking Authentication...</div>

    }

    
    const Detalle = (async (ini,fin) => {

        setLoading(true);
        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/ReporteResultadoAcumulado/RegistroCivil',
            { dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            var arrr = result.data;

            arrr.forEach((element) => {
                toast(<a href={'https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/RegistroCivil/'+element.respuesta} target="_blank">Descargar Archivo {element.respuesta}</a>)
                // console.log(element.id);

            });

            setLoading(false);

        } else {

            setLoading(false);
            toast('Archivo No Generado', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            // Buscar()
        }
    })


    const customStyles = {
        rows: {
            style: {
                minHeight: '60px', // override the row height
                maxHeight: '70px',
                border: '2px solid #a9dff0',
                borderRadius: '3px'
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#a9dff0',

            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize: '16px',


            },
        },
    };


    const columns = [
        {
            name: <div className="text-wrap">Año</div>,
            selector: row => row.ao ,
            center: true
        },
        {
            name: <div className="text-wrap">Mes</div>,
            selector: row => row.mes ,
            center: true
        },
        {
            name: <div className="text-wrap">Cantidad</div>,
            selector: row => row.cantidad,
            center: true
        },
        {
            name: <div></div>,
            cell: (row) => <button onClick={() => (Detalle(row.ini,row.fin))} className="btn btn-info  mt-4">Descarga</button>,
            center: true,
            button: true,
        }
    ];


    // const detalleModal = (carga) => {

    //     alert(carga)
    //     setDataModalCarga(carga)
    //     setMostrarModal(true)

    //     alert(modalCarga)
    // }

    return (
        <>

            <ToastContainer />

            {loading ? (
                <div className="d-flex justify-content-center mt-3">
                    <DotLoader
                        className='loading'
                        color={'#5b198ab5'}
                        loading={loading}
                        size={60}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>

            ) : (
                <div className="mt-1">

                    <DataTable
                        columns={columns}
                        data={data}
                        // highlightOnHover
                        pagination
                        customStyles={customStyles}

                    />
                </div>
            )}


            {/* <Modal onCierre={handleOnCerrar} visible={mostrarModal}/> */}



        </>
    )
}
export default ListarCargas
