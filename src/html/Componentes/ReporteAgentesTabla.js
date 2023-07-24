import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ReporteAgentesTabla({ flujo, campana, ini, fin }) {

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
            Fecha: v.fecha,
            Llamadas_recibidas: parseFloat(v.recibidas),
            Llamadas_atendidas: parseFloat(v.atendidas),
            Llamadas_abandonadas: parseFloat(v.recibidas - v.atendidas),
            Nivel_atención: parseFloat(100 * (v.atendidas / v.recibidas)).toFixed(2) + " %",
            Nivel_servicio: parseFloat(100 * (v.llamadas_dimensionadas / v.atendidas)).toFixed(2) + " %",
            Minutos_hablados: parseFloat(v.n_atencion_e / 60).toFixed(2),
            TMO: parseFloat(v.tmo / 60).toFixed(2),
            Tiempo_espera_promedio: parseFloat(v.agentes_r).toFixed(2)
        }));


        let ws = XLSX.utils.json_to_sheet(arr2);

        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Informacion Diaria");

        XLSX.writeFile(wb, "Agente_" + date + ".xlsx");
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


        axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Session_Check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Agente/Intervalo',
            { dato: ini, dato_1: fin, dato_2: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {



            setData(result.data);
            setLoading(false)
        }
        setLoading(false)
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


    const columns = [
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => row.user,
            center: true
        },
        {
            name: <div className="text-wrap">Pausa</div>,
            selector: row => secondsToString(parseInt(row.pause_sec)),
            center: true
        },
        {
            name: <div className="text-wrap">Espera</div>,
            selector: row => secondsToString(parseInt(row.wait_sec)),
            center: true
        },
        {
            name: <div className="text-wrap">Hablando</div>,
            selector: row => secondsToString(parseInt(row.talk_sec)),
            center: true
        },
        {
            name: <div className="text-wrap">Disponible</div>,
            selector: row => secondsToString(parseInt(row.dispo_sec)),
            center: true
        },
        {
            name: <div className="text-wrap">Muerto</div>,
            selector: row => secondsToString(parseInt(row.dead_sec)),
            center: true
        },
        {
            name: <div className="text-wrap">Contestadas</div>,
            selector: row => row.inbound_calls,
            center: true
        }

    ]

    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Información Agente</h4>
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
                                    <div className=" mt-2 "  >
                                        <section className=" float-start mb-2">
                                            <button
                                                onClick={handleOnExportCarga}
                                                className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                                <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                            </button>
                                        </section>
                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            customStyles={customStyles}
                                            striped
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
export default ReporteAgentesTabla