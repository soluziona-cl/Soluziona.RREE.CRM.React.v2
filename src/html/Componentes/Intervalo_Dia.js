import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";

import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";



function IntervaloDiaPanel({ flujo, periodo, nombre }) {


    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += parseInt(item[key]);
        });
        return total;
    };

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
            Hora: v.intervalo,
            Llamadas_Recibidas: parseFloat(v.recibidas),
            Llamadas_Atendidas: parseFloat(v.contestadas),
            Llamadas_Tiempo_Respuesta_Mayor_5s: parseFloat(v.ate5),
            Llamadas_Atendidas_Menor_10s: parseFloat(v.ate10),
            Llamadas_Atendidas_Menor_15s: parseFloat(v.ate15),
            Llamadas_Abandonadas_Menor_5s: parseFloat(v.abo5),
            Llamadas_Abandonadas_Menor_10s: parseFloat(v.abo10),
            Llamadas_Abandonadas: parseFloat(v.abandonadas),
            Nivel_de_Atencion_Ejecutivos_95: parseFloat(v.natencion)+' %',
            Nivel_de_Servicio_Ejecutivos_85: parseFloat(v.nservicio)+' %',
            Nivel_de_Atencion_Menos_Abnd_Espontaneo: parseFloat(v.nabandonoesp)+' %',
            Nivel_de_Servicio_IVR_98: parseFloat(v.nsivr)+' %',
            T_O: parseFloat(v.agentes),
            TMO_OPER: parseFloat(v.tmo),
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Inbound/Intervalo/Now',
            { dato: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {
            // result.data.unshift({
            //     mes: "totals",
            //     recibidas: getTotals(result.data, "recibidas"),
            //     three: getTotals(result.data, "three"),
            //     four: getTotals(result.data, "four"),
            //     five: getTotals(result.data, "five"),
            //     six: "",
            //     seven: "",
            //     eight: "",
            //     nine:"",
            // });

            setData(result.data);
            setLoading(false)

        }
        else { setLoading(false) }
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


    var columns = [
        {
            name: <div className="text-wrap">Hora</div>,
            selector: row => row.intervalo,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS RECIBIDAS</div>,
            selector: row => row.recibidas,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ATENDIDAS</div>,
            selector: row => row.contestadas,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS TIEMPO RESPUESTA {'>'} 5"</div>,
            selector: row => row.ate5,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ATENDIDAS {'<'} 10 seg.</div>,
            selector: row => row.ate10,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ATENDIDAS {'<'} 15 "</div>,
            selector: row => row.ate15,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ABAND. {'<'}5 SEG.</div>,
            selector: row => row.abo5,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ABAND. {'<'} 10 SEG.</div>,
            selector: row => row.abo10,
            center: true
        },
        {
            name: <div className="text-wrap">LLAMADAS ABAND.</div>,
            selector: row => row.abandonadas,
            center: true
        },
        {
            name: <div className="text-wrap">NIVEL DE ATENCION Ejecutivos (95%)</div>,
            selector: row => row.natencion + ' %',
            center: true
        },
        {
            name: <div className="text-wrap">NIVEL DE SERVICIO Ejecutivos (85%)</div>,
            selector: row => row.nservicio + ' %',
            center: true
        },
        {
            name: <div className="text-wrap">NIVEL DE ATENCIÓN. (-) ABND. ESPONTANEO</div>,
            selector: row => row.nabandonoesp + ' %',
            center: true
        },
        {
            name: <div className="text-wrap">NIVEL DE SERVICIO IVR (98%)</div>,
            selector: row => row.nsivr + ' %',
            center: true
        },
        {
            name: <div className="text-wrap">T.O.</div>,
            selector: row => row.agentes,
            center: true
        },
        {
            name: <div className="text-wrap">TMO OPER.</div>,
            selector: row => row.tmo,
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
                                <h4 className="my-0 font-weight-normal">Intervalo Dia {periodo} - {nombre}</h4>
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
export default IntervaloDiaPanel