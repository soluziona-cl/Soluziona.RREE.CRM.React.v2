import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";
import ReactEcharts from "echarts-for-react";
import { parse } from 'date-fns';

function ResumenRepoVideoLlamada({ flujo, campana, ini, fin }) {

    const [data, setDatapie] = useState([]);
    const [datafull, setData] = useState([]);
    const [datafull0, setData0] = useState([]);
    const [dataEpa1, setDataEpa1] = useState([]);
    const [dataEpa2, setDataEpa2] = useState([]);
    const [dataEpa3, setDataEpa3] = useState([]);

    const [dataEpa1_g, setDataEpa1G] = useState([]);
    const [dataEpa2_g, setDataEpa2G] = useState([]);
    const [dataEpa3_g, setDataEpa3G] = useState([]);


    const [dataTotals1, setdataTotals1] = useState([]);
    const [dataMes, setDataMes] = useState([]);
    const [datafull_encuestas, setDataEncuestas] = useState([]);
    const [datafull_encuestas_resumen, setDataEncuestasResumen] = useState([]);

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

        var arr2 = datafull0.map(v => ({
            // Fecha: v.fecha,
            Indice: v.indice,
            Fecha: v.fecha,
            Hora: v.hora,
            Videollamada: (v.fecha === null) ? "-" : v.videollamada,
            Agente: (v.hora === null) ? "-" : v.agente,
            Nombre_Agente: v.nomagente,
            Rut: v.rut,
            Observacion: v.observacion,

        }));

        var arr2 = datafull.map(v => ({
            // Fecha: v.fecha,
            Solucion: v.solucion,
            Cantidad: v.cantidad,
            Porcentaje: v.porcentaje,

        }));

        var arr3 = dataEpa2.map(v => ({
            // Fecha: v.fecha,
            Solucion: v.solucion,
            Cantidad: v.cantidad,
            Porcentaje: v.porcentaje,
        }));

        var arr4 = datafull_encuestas.map(v => ({
            Indice: v.indice,
            Fecha: v.fecha,
            Hora: v.hora,
            Videollamada: (v.fecha === null) ? "-" : v.videollamada,
            Agente: (v.hora === null) ? "-" : v.agente,
            Nombre_Agente: v.nomagente,
            Rut: v.rut,
            Observacion: v.observacion,
        }));

        //let ws = XLSX.utils.json_to_sheet(arr2);
        // let ws1 = XLSX.utils.json_to_sheet(arr3);
        let ws2 = XLSX.utils.json_to_sheet(arr4);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws2, "Reporte Videollamda");
        // XLSX.utils.book_append_sheet(wb, ws1, "Epa2");
        // XLSX.utils.book_append_sheet(wb, ws2, "Encuestas");
        XLSX.writeFile(wb, "Videollamada" + date + ".xlsx");
    };

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        // setTimeout(() => {
        //     setLoading(false)
        // }, 3000)
    }, [])


    useEffect(() => {

        const token = getToken();
        const rutaservidor = "/Orkesta/Soluziona/CRM_RREE"
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

        //primera tabla

        Datos_Canales()  //tabla de detalle registros
    }, []);




    const Datos_Canales = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/VideoLLamada',
            { dato: ini, dato_1: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            //  console.log(result.data)


            setDataEncuestas(result.data);
            setData0(result.data)
            setLoading(false)

        }
        else {

            setLoading(false)
        }

    })

    const customStyles = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '50px',
                border: '1px solid #a9dff0',
                borderRadius: '3px'
            },
            striped: {
                backgroundColor: '#a9dff0',
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
                fontSize: '12px',

            },

        },

    };


    // encuestas
    const columns_encuestas = [
        {
            name: <div className="text-wrap">Indice</div>,
            selector: row => row.indice,
            center: true
        },
        {
            name: <div className="text-wrap">Fecha</div>,
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">Hora</div>,
            selector: row => row.hora,
            center: true
        },
        {
            name: <div className="text-wrap">VideoLLamada</div>,
            selector: row => (row.fecha === null) ? "-" : row.videollamada,
            center: true
        },
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => (row.hora === null) ? "-" : row.agente,
            center: true
        },
        {
            name: <div className="text-wrap">Nombre Agente</div>,
            selector: row => row.nomagente,
            center: true
        },
        {
            name: <div className="text-wrap">Rut</div>,
            selector: row => row.rut,
            center: true
        },
        {
            name: <div className="text-wrap">Observacion</div>,
            selector: row => row.observacion,
            center: true
        }

    ];


    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Información Diaria</h4>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <div className="d-flex justify-content-center mt-3">
                                        <ClockLoader
                                            className='loading'
                                            color={'#5b198ab5'}
                                            loading={loading}
                                            size={60}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-5"  >
                                        <button
                                        onClick={handleOnExportCarga}
                                        className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                        <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                    </button>
                                        <DataTable
                                            columns={columns_encuestas}
                                            data={datafull_encuestas}
                                            customStyles={customStyles}
                                            striped
                                            pagination
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
export default ResumenRepoVideoLlamada