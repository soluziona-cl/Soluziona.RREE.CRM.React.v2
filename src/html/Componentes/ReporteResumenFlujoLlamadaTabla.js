import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ReporteResumenFlujoLlamadaTabla({ flujo, ini, fin, nombre }) {

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
            Intervalo: v.intervalo,
            Call_DisRecibidas: parseFloat(v.recibidas),
            Atendidas: parseFloat(v.atendidas),
            Llamadas_Abandonadas:parseFloat(v.recibidas - v.atendidas),
            Nivel_de_Atención_esperado: parseFloat(100 * (v.atendidas / v.recibidas)).toFixed(2) +" %",
            Nivel_de_Servicio: parseFloat( 100 * (v.llamadas_dimensionadas / v.atendidas)).toFixed(2) +" %",
            Minutos_Hablados: parseFloat(v.n_atencion_e/60).toFixed(2),
            TMO: parseFloat(v.tmo/60).toFixed(2),
            Tiempos_Espera: parseFloat(v.agentes_r).toFixed(2)
        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Carga");
        XLSX.writeFile(wb, "Gestion_Carga_" + date + ".xlsx");
    };

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        // setTimeout(() => {
        //     setLoading(false)
        // }, 2000)
    }, [])


    useEffect(() => {

        const token = getToken();
        const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Detalle/Reporte',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData(result.data);
            setLoading(false)
        }
else{setLoading(false)}
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
                fontSize: '14px',

            },

        },

    };


    // const columns = [
    //     {
    //         name: 'Intervalo',
    //         selector: row => row.intervalo,
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Llamadas Recibidas</div>,
    //         selector: row => row.recibidas,
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Llamadas Atendidas</div>,
    //         selector: row => row.atendidas,
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Llamadas Abandonadas</div>,
    //         selector: row => row.recibidas - row.atendidas, //aqui
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Llamadas Atendidas 15 seg. </div>,
    //         selector: row => row.llamadas_dimensionadas, //aqui
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Nivel Atención</div>,
    //         selector: row => (row.recibidas === '0') ? 0 : parseFloat(100 * (row.atendidas / row.recibidas)).toFixed(2),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Nivel Servicio</div>,
    //         selector: row => (row.atendidas === '0') ? 0 :parseFloat( 100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Minutos Hablados</div>,
    //         selector: row => ((row.n_atencion_e)/60).toFixed(2),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">TMO</div>,
    //         selector: row => parseInt(row.tmo),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Tiempo Espera Promedio</div>,
    //         selector: row => parseFloat(row.agentes_r).toFixed(2),
    //         center: true
    //     }
    // ];

    const columns = [
        {
            name: 'Intervalo',
            selector: row => row.intervalo,
            center: true
        },
        {
            name: <div className="text-wrap">Llamadas Recibidas</div>,
            selector: row => row.recibidas,
            center: true
        },
        {
            name: <div className="text-wrap">Llamadas Atendidas</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">Llamadas Abandonadas</div>,
            selector: row => row.recibidas - row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">Llamadas Atendidas 15 seg. </div>,
            selector: row => row.llamadas_dimensionadas,
            center: true
        },
        {
            name: <div className="text-wrap">Nivel Atención</div>,
            selector: row => (row.recibidas === '0') ? 0 : parseFloat(100 * (row.atendidas / row.recibidas)).toFixed(2) + " %",
            center: true
        },
        {
            name: <div className="text-wrap">Nivel Servicio</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) + " %",
            center: true
        },
        {
            name: <div className="text-wrap">Minutos Hablados</div>,
            selector: row => parseFloat(row.n_atencion_e/60).toFixed(2),
            center: true
        },
        {
            name: <div className="text-wrap">TMO</div>,
            selector: row => (parseFloat(row.tmo/60).toFixed(2)),
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo Espera Promedio (Segundos)</div>,
            selector: row =>parseFloat(row.agentes_r).toFixed(2),
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
                                <h4 className="my-0 font-weight-normal">Tráfico</h4>
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
                                    <div className="mt-1">
<section className=" float-start">
                                <button
                                    onClick={handleOnExportCarga}
                                    className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                    <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                </button>
                            </section>
                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            // highlightOnHover
                                            striped
                                            customStyles={customStyles}

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
export default ReporteResumenFlujoLlamadaTabla