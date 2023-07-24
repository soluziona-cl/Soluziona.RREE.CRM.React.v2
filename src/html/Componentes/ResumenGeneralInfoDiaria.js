import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ResumenGeneralInfoDiaria({ flujo, campana, ini, fin }) {

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

        // var arr2 = columns.map(col => ({
        //     name: col.name.props ? col.name.props.children : col.name,
        //     selector: col.selector,
        //     center: col.center,
        //   }));

        var arr3 = dataMes.map(v => ({
            Hora: v.intervalo,
            "LLAMADAS RECIBIDAS": parseFloat(v.recibidas),
            "LLAMADAS ATENDIDAS": parseFloat(v.contestadas),
            "LLAMADAS TIEMPO RESPUESTA > 5": parseFloat(v.ate5),
            "LLAMADAS ATENDIDAS < 10 seg.": parseFloat(v.ate10),
            "LLAMADAS ATENDIDAS < 15": parseFloat(v.ate15),
            "LLAMADAS ABAND. < 5 SEG.": parseFloat(v.abo5),
            "LLAMADAS ABAND. < 10 SEG.": parseFloat(v.abo10),
            "LLAMADAS ABAND.": parseFloat(v.abandonadas),
            "NIVEL DE ATENCION Ejecutivos (95%)": parseFloat(v.natencion)+' %',
            "NIVEL DE SERVICIO Ejecutivos (85%)": parseFloat(v.nservicio)+' %',
            "NIVEL DE ATENCIÓN. (-) ABND. ESPONTANEO": parseFloat(v.nabandonoesp)+' %',
            "NIVEL DE SERVICIO IVR (98%)": parseFloat(v.nsivr)+' %',
            "T.O.": parseFloat(v.agentes),
            "TMO OPER.": parseFloat(v.tmo),
        }));

        // var arr4 = datafull_canales.map(v => ({
        //     Canales: v.origen,
        //     Cantidad: v.cantidad,

        // }));

        // let ws = XLSX.utils.json_to_sheet(arr2);
        let ws1 = XLSX.utils.json_to_sheet(arr3);
        // let ws2 = XLSX.utils.json_to_sheet(arr4);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        // XLSX.utils.book_append_sheet(wb, ws, "Informacion Diaria");
        XLSX.utils.book_append_sheet(wb, ws1, "Consolidado Mes");
        // XLSX.utils.book_append_sheet(wb, ws2, "Canales");
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Inbound/Mes',
            { dato: ini, dato_1: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)

            setDataMes(result.data);
            setLoading(false)
        }
        else { setLoading(false) }
    })

    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += (item[key] === null) ? 0 : parseInt(item[key]);
        });
        return total;
    };



    const Datos_Canales = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Inbound/Intervalo',
            { dato: ini, dato_1: fin, dato_2: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData(result.data);

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
                paddingLeft: '10px', // override the cell padding for head cells
                paddingRight: '10px',
                backgroundColor: '#a9dff0',
                fontSize: '15px',
                width: '250px'
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



    var columns_mes = [
        {
            name: <div className="text-wrap">FECHA</div>,
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
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Consolidado Mes</h4>
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
                                            data={dataMes}
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
export default ResumenGeneralInfoDiaria