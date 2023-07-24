import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ResumenGeneralTipi({ flujo, campana, ini, fin }) {

    const [datafull, setData] = useState([]);
    const [dataMes, setDataMes] = useState([]);
    const [datafull_canales, setDataCanales] = useState([]);
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

        var arr3 = dataMes.map(v => ({
            Fecha: v.fecha,
            Llamadas_recibidas: v.recibidas,
            Llamadas_atendidas: v.atendidas,
            Llamadas_abandonadas: v.recibidas - v.atendidas,
            Nivel_atención: parseFloat(100 * (v.atendidas / v.recibidas)).toFixed(2) + " %",
            Nivel_servicio: parseFloat(100 * (v.llamadas_dimensionadas / v.atendidas)).toFixed(2) + " %",
            Minutos_hablados: parseFloat(v.n_atencion_e / 60).toFixed(2),
            TMO: parseFloat(v.tmo / 60).toFixed(2),
            Tiempo_espera_promedio: parseFloat((v.agentes_r / v.atendidas)).toFixed(2)
        }));

        var arr4 = datafull_canales.map(v => ({
            Canales: v.origen,
            Cantidad: v.cantidad,

        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        let ws1 = XLSX.utils.json_to_sheet(arr3);
        let ws2 = XLSX.utils.json_to_sheet(arr4);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Informacion Diaria");
        XLSX.utils.book_append_sheet(wb, ws1, "Consolidado Mes");
        XLSX.utils.book_append_sheet(wb, ws2, "Canales");
        XLSX.writeFile(wb, "Trafico" + date + ".xlsx");
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
        Datos_Canales()

    }, []);

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Tipificaciones/Resumen',
            { dato: ini, dato_1: fin, dato_2: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {


            setDataMes(result.data);
            setLoading(false)
        }

    });

    const Datos_Canales = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Tipificaciones/Detalle',
            { dato: ini, dato_1: fin, dato_2: 1001 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            setData(result.data)

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


    const columns = [
        {
            name: <div className="text-wrap">Fecha</div>,
            selector: row => row.aaaammdd,
            center: true
        },
        {
            name: <div className="text-wrap">Estado</div>,
            selector: row => row.estado,
            center: true
        },
        {
            name: <div className="text-wrap">Contestadas</div>,
            selector: row => row.contestadas,
            center: true
        },
        {
            name: <div className="text-wrap">Abandonadas</div>,
            selector: row => row.abandonadas,
            center: true
        }

        ,
        {
            name: <div className="text-wrap">Fuera Horario</div>,
            selector: row => row.fuerahorario,
            center: true
        }
        ,
        {
            name: <div className="text-wrap">No Efectivo</div>,
            selector: row => row.noefectivo,
            center: true
        }
        ,
        {
            name: <div className="text-wrap">No Gestionado</div>,
            selector: row => row.nogestionado,
            center: true
        }
    ];


    const columns_mes = [
        {
            name: <div className="text-wrap">fecha</div>,
            selector: row => row.aaaammdd,
            center: true
        },
        {
            name: <div className="text-wrap">estado</div>,
            selector: row => row.estado,
            center: true
        },
        {
            name: <div className="text-wrap">ANI</div>,
            selector: row => row.phone_number,
            center: true
        }
        ,
        {
            name: <div className="text-wrap">Estado Llamada</div>,
            selector: row => row.estado_llamada,
            center: true
        }
        ,
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => row.agente,
            center: true
        }
    ]


    // canales
    // const columns_canales = [
    //     {
    //         name: <div className="text-wrap">Canales</div>,
    //         selector: row => row.origen,
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Llamadas</div>,
    //         selector: row => row.cantidad,
    //         center: true
    //     }

    // ];


    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resumen Tipificaciones</h4>
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
                                            data={dataMes}
                                            customStyles={customStyles}
                                            striped
                                            pagination={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Detalle Tipificaciones</h4>
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
                                    <div className=" mt-5 "  >
                                        <DataTable
                                            columns={columns_mes}
                                            data={datafull}
                                            customStyles={customStyles}
                                            striped
                                            pagination={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            {/* <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resumen Canales</h4>
                            </div>
                            <div className="card-body d-flex justify-content-center">
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

                                ) 
                                : (
                                    <div className="mt-5 col-6"  >

                                        <DataTable
                                            columns={columns_canales}
                                            data={datafull_canales}
                                            customStyles={customStyles}
                                            striped
                                        />
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </div>

                </div>

            </div> */}

        </>
    )
}
export default ResumenGeneralTipi