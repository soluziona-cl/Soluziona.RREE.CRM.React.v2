import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ResumenGeneralInfoDiariaTrafico({ flujo, campana, ini, fin }) {

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
            Llamadas_15_segundos: parseFloat(v.llamadas_dimensionadas),
            Nivel_atención: parseFloat(100 * (v.atendidas / v.recibidas)).toFixed(2) + " %",
            Nivel_servicio: parseFloat(100 * (v.llamadas_dimensionadas / v.atendidas)).toFixed(2) + " %",
            Minutos_hablados: parseFloat((v.n_atencion_e) / 60).toFixed(2),
            TMO: (v.atendidas === '0') ? 0 : parseFloat((v.n_atencion_e / 60) / v.atendidas).toFixed(2),
            Tiempo_espera_promedio: (v.fecha === 'Total') ? parseFloat(v.agentes_r / v.atendidas).toFixed(2) : parseFloat(v.agentes_r).toFixed(2)
        }));

        var arr3 = dataMes.map(v => ({
            Fecha: v.fecha,
            Llamadas_recibidas: parseFloat(v.recibidas),
            Llamadas_atendidas: parseFloat(v.atendidas),
            Llamadas_abandonadas: parseFloat(v.recibidas - v.atendidas),
            Nivel_atención: v.n_atencion_o,
            Nivel_servicio: 100 * (v.llamadas_dimensionadas / v.atendidas).toFixed(2),
            Minutos_hablados: v.n_atencion_e,
            TMO: v.TMO,
            Tiempo_espera_promedio: v.agentes_r
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado/Reporte',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            // console.log(result.data)

            // setDataMes([{
            //     fecha: "Total",
            //     recibidas: getTotals(result.data, "recibidas"),
            //     atendidas: getTotals(result.data, "atendidas"),
            //     n_atencion_o: getTotals(result.data, "n_atencion_o"),
            //     n_atencion_e: getTotals(result.data, "n_atencion_e"),
            //     agentes_r: getTotals(result.data, "agentes"),
            //     tmo: getTotals(result.data, "tmo"),
            //     llamadas_dimensionadas: getTotals(result.data, "llamadas_dimensionadas"),
            // }])
            result.data.unshift({
                sobre_bajo_trafico: "-",
                fecha: "Total",
                recibidas: getTotals(result.data, "recibidas"),
                atendidas: getTotals(result.data, "atendidas"),
                n_atencion_o: getTotals(result.data, "n_atencion_o"),
                n_atencion_e: getTotals(result.data, "n_atencion_e"),
                agentes_r: getTotals(result.data, "agentes"),//tiempo espera promedio
                tmo: getTotals(result.data, ("tmo")).toFixed(2),
                llamadas_dimensionadas: getTotals(result.data, "llamadas_dimensionadas"),

                // three: getTotals(result.data, "three"),
                // four: getTotals(result.data, "four"),
                // five: getTotals(result.data, "five"),
                // six: "",
                // seven: "",
                // eight: "",
                // nine:"",
            });
            console.log(result.data)
            // setDataTotal([{
            //     recibidas: getTotals(result.data, "recibidas")

            // }])


            // setDataMes([{
            //     fecha: "total",//aqui
            //     recibidas: getTotals(result.data, "recibidas"),//recibidas
            //     atendidas: getTotals(result.data, "atendidas"),//atendidas
            //     n_atencion_o: getTotals(result.data, "n_atencion_o"),//nivel atencion
            //     n_atencion_e: getTotals(result.data, "n_atencion_e"),//minutos hablados
            //     agentes_r: getTotals(result.data, "agentes_r"),//tiempo espera promedio
            //     tmo: getTotals (result.data, secondsToString(parseInt("tmo").toFixed(2)))
            // }])
            setData(result.data);
            setLoading(false)
        }
        else { setLoading(false) }
    })

    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += (item[key] === null) ? 0 : parseFloat(item[key]);
        });
        return total;
    };




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
            selector: row => row.fecha,
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
            selector: row => row.recibidas - row.atendidas, //aqui
            center: true
        },
        {
            name: <div className="text-wrap">Llamadas 15 Segundos</div>,
            selector: row => (row.atendidas === '0') ? 0 : (row.llamadas_dimensionadas),
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
            selector: row => parseFloat(row.n_atencion_e / 60).toFixed(2),
            center: true
        },
        {
            name: <div className="text-wrap">TMO</div>,
            selector: row =>(row.atendidas === '0') ? 0 : parseFloat((row.n_atencion_e / 60) / row.atendidas).toFixed(2),
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo Espera Promedio</div>,
            selector: row => (row.fecha === 'Total') ? parseFloat(row.agentes_r / row.atendidas).toFixed(2) : parseFloat(row.agentes_r).toFixed(2),
            center: true
        }
    ];

    // const columns_mes = [
    //     {
    //         name: <div className="text-wrap">Fecha</div>,
    //         selector: row => row.fecha,
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
    //         selector: row => row.recibidas - row.atendidas,
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Nivel Atención</div>,
    //         selector: row => (row.recibidas === '0' || row.recibidas == (row.recibidas - row.atendidas)) ? 0 : parseFloat(((row.atendidas / row.recibidas) * 100)).toFixed(2) + " %",

    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Nivel Servicio</div>,
    //         selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) + " %",
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Minutos Hablados</div>,
    //         selector: row => parseFloat(row.n_atencion_e / 60).toFixed(2),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">TMO</div>,
    //         selector: row => (parseFloat((row.n_atencion_e / 60) / row.atendidas).toFixed(2)),
    //         center: true
    //     },
    //     {
    //         name: <div className="text-wrap">Tiempo Espera Promedio</div>,
    //         selector: row => parseFloat(row.agentes_r / row.atendidas).toFixed(2),
    //         center: true
    //     }
    // ]

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
                                    <div className="mt-2"  >
                                        <section className=" float-start mb-2">
                                            <button
                                                onClick={handleOnExportCarga}
                                                className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                                <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                            </button>
                                        </section>
                                        {/* <div className=" mt-5 "  >
                                            <DataTable
                                                columns={columns_mes}
                                                data={dataMes}
                                                customStyles={customStyles}
                                                striped />
                                        </div> */}
                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            customStyles={customStyles}
                                            striped
                                            noHeader={false}
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
export default ResumenGeneralInfoDiariaTrafico