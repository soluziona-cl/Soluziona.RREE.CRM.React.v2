import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import DotLoader from "react-spinners/DotLoader";

function ReporteDetalleFlujoLlamadaTabla({ flujo, ini, fin, nombre }) {

    const [datafull, setData] = useState([]);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };

    function secondsToString(seconds) {
        var hour = Math.floor(seconds / 3600);
        hour = hour < 10 ? "0" + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = minute < 10 ? "0" + minute : minute;
        var second = seconds % 60;
        second = second < 10 ? "0" + second : second;
        return hour + ":" + minute + ":" + second;
    }

    const handleOnExportCarga = () => {

        //creates a new workbook
        let wb = XLSX.utils.book_new();

        var arr2 = datafull.map(v => ({
            Id_Llamada: v.idllamada,
            DNIS: v.dnis,
            ANI: v.ani,
            RUT: v.rut,
            Fecha: v.fecha,
            HoraInicio: v.horainicio,
            HoraTermino: v.horatermino,
            FlujoLlamada: v.flujollamada,
            Agente: v.ejecutivo,
            TipoCliente: v.tipocliente,
            OpcionIVR: v.opcionivr,
            Grupo: v.grupo,
            Ejecutivo: v.ejecutivo,
            SoloAutoatención: v.soloautoatencion,
            IvrTime: v.ivrtime,
            WaitTime: v.waittime,
            AnswerTime: v.answertime,
            TiempoTotal: v.tiempototal,
            TiempoIN: v.tiempoin
        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "ReporteDetalleFlujo");
        XLSX.writeFile(wb, "ReporteDetalleFlujo" + date + ".xlsx");
    };

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }, [])


    useEffect(() => {

        const token = getToken();
        const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM"
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_Check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(true);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(true);
            });

        Datos()

    }, []);

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Flujo/Detalle',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData(result.data);
            // setData([{
            //     "fecha": "3/18/2022",
            //     "llamadas_dimensionadas": 83,
            //     "recibidas": 87,
            //     "atendidas": 86,
            //     "sobre_bajo_trafico": 91,
            //     "debio_atender": 92,
            //     "n_atencion_e": 99,
            //     "n_atencion_o": 85,
            //     "agentes": 85,
            //     "TMO": 94,
            //     "agentes_r": 94
            //   }]);
        }

    })


    const customStyles = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '50px',
                border: '2px solid #a9dff0',
                borderRadius: '3px'
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#a9dff0',
                fontSize: '16px',

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
            name: 'Id Llamada',
            selector: row => row.idllamada,
            center: true
        },
        {
            name: <div className="text-wrap">DNIS</div>,
            selector: row => row.dnis,
            center: true
        },
        {
            name: <div className="text-wrap">ANI</div>,
            selector: row => row.ani,
            center: true
        },
        {
            name: <div className="text-wrap">RUT</div>,
            selector: row => row.rut,
            center: true
        },
        {
            name: <div className="text-wrap">Fecha</div>,
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">Hora Inicio</div>,
            selector: row => row.horainicio,
            center: true
        },
        {
            name: <div className="text-wrap">Hora Termino</div>,
            selector: row => row.horatermino,
            center: true
        },
        {
            name: <div className="text-wrap">Flujo Llamada</div>,
            selector: row => row.flujollamada,
            center: true
        },
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => row.ejecutivo,
            center: true
        },
        {
            name: <div className="text-wrap">Tipo Cliente</div>,
            selector: row => row.tipocliente,
            center: true
        },
        {
            name: <div className="text-wrap">Opcion IVR</div>,
            selector: row => row.opcionivr,
            center: true
        },
        {
            name: <div className="text-wrap">Grupo</div>,
            selector: row => row.grupo,
            center: true
        },
        {
            name: <div className="text-wrap">Ejecutivo</div>,
            selector: row => row.ejecutivo,
            center: true
        },
        {
            name: <div className="text-wrap">Solo Autoatención</div>,
            selector: row => row.soloautoatencion,
            center: true
        },
        {
            name: <div className="text-wrap">Ivr Time</div>,
            selector: row => row.ivrtime,
            center: true
        },
        {
            name: <div className="text-wrap">Wait Time</div>,
            selector: row => row.waittime,
            center: true
        },
        {
            name: <div className="text-wrap">Answer Time</div>,
            selector: row => row.answertime,
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo Total</div>,
            selector: row => row.tiempototal,
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo IN</div>,
            selector: row => row.tiempoin,
            center: true
        },

    ];


    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Detalle Resumen Gestion - {nombre}</h4>
                            </div>
                            <div className="card-body">
                                <section className=" float-end">
                                    <button
                                        onClick={handleOnExportCarga}
                                        className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                        <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                    </button>
                                </section>
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
                                    <div className=" mt-5 "  >

                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            customStyles={customStyles}
                                            pagination
                                            noDataComponent="Los Filtros No Contiene Datos" //or your component
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}
export default ReporteDetalleFlujoLlamadaTabla