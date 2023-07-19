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
            Nivel_atención: parseFloat(100*(v.atendidas / v.recibidas)).toFixed(2) +" %",
            Nivel_servicio:parseFloat(100*(v.llamadas_dimensionadas / v.atendidas)).toFixed(2) +" %",
            Minutos_hablados: parseFloat(v.n_atencion_e/60).toFixed(2),
            TMO: parseFloat(v.tmo/60).toFixed(2),
            Tiempo_espera_promedio: parseFloat(v.agentes_r).toFixed(2)
        }));

        var arr3 = dataMes.map(v => ({
            Fecha: v.fecha,
            Llamadas_recibidas: v.recibidas,
            Llamadas_atendidas: v.atendidas,
            Llamadas_abandonadas: v.recibidas - v.atendidas,
            Nivel_atención: parseFloat(100*(v.atendidas / v.recibidas)).toFixed(2) +" %",
            Nivel_servicio:parseFloat(100*(v.llamadas_dimensionadas / v.atendidas)).toFixed(2) +" %",
            Minutos_hablados: parseFloat(v.n_atencion_e/60).toFixed(2),
            TMO: parseFloat(v.tmo/60).toFixed(2),
            Tiempo_espera_promedio: parseFloat((v.agentes_r/v.atendidas)).toFixed(2)
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
        Datos_Canales()

    }, []);

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado/Reporte',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)


            setDataMes([{
                fecha: ini.substring(4, 6) + "-" +ini.substring(0, 4),
                recibidas: getTotals(result.data, "recibidas"),
                atendidas: getTotals(result.data, "atendidas"),
                n_atencion_o: getTotals(result.data, "n_atencion_o"),
                n_atencion_e: getTotals(result.data, "n_atencion_e"),
                agentes_r: getTotals(result.data, "agentes"),
                tmo: getTotals (result.data, "tmo"),
                llamadas_dimensionadas: getTotals(result.data, "llamadas_dimensionadas"),
            }])
            setData(result.data);
            setLoading(false)
        }
else{setLoading(false)}
    })

    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += (item[key] === null) ? 0 : parseInt(item[key]);
        });
        return total;
    };

    const Datos_Canales = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado/Reporte/Canales',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setDataCanales(result.data);
          
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
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">DISPO</div>,
            selector: row => row.recibidas,
            center: true
        },
        {
            name: <div className="text-wrap">CONEXT</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">NACEXT</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">REGSER</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">PERDEF</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">EXTSER</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">PROSER</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">VISTEM</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">ESTVIS</div>,
            selector: row => (row.recibidas === '0' || row.recibidas == (row.recibidas - row.atendidas)) ? 0 : parseFloat(((row.atendidas/row.recibidas)*100)).toFixed(2) +" %",
                                                                
            center: true
        },
        {
            name: <div className="text-wrap">VISTRA</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECVEN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECRUN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECESP</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECECU</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOMJC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOSER</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOSRC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOMIN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOCEX</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">APOCHI</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECARG</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">RECCOL</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">REGMIN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">LEGCHI</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">TRADUC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">LEGEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">EMEMAS</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">SALMEN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">VISCOP</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">SERSCO</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">REGCIV</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">PRECSO</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">OTROS</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        // ,
        // {
        //     name: <div className="text-wrap"></div>,
        //     selector: row => parseFloat(row.n_atencion_e/60).toFixed(2),
        //     center: true
        // },
        // {
        //     name: <div className="text-wrap">TMO</div>,
        //     selector: row => row.tmo, 
        //     center: true
        // },
        //         {
        //     name: <div className="text-wrap">TMO</div>,
        //     selector: row =>(row.atendidas === '0') ? 0 : parseFloat((row.n_atencion_e/60)/row.atendidas).toFixed(2), 
        //     center: true
        // },
        // {
        //     name: <div className="text-wrap">Tiempo Espera Promedio</div>,
        //     selector: row => parseFloat(row.agentes_r).toFixed(2),
        //     center: true
        // }
    ];


    const columns_mes = [
        {
            name: <div className="text-wrap">Mes</div>,
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">T.DISPO</div>,
            selector: row => row.recibidas,
            center: true
        },
        {
            name: <div className="text-wrap">T.CONEXT</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">T.NACEXT</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">T.REGSER</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">T.PERDEF</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">T.EXTSER</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">T.PROSER</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">T.VISTEM</div>,
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">T.ESTVIS</div>,
            selector: row => (row.recibidas === '0' || row.recibidas == (row.recibidas - row.atendidas)) ? 0 : parseFloat(((row.atendidas/row.recibidas)*100)).toFixed(2) +" %",
                                                                
            center: true
        },
        {
            name: <div className="text-wrap">T.VISTRA</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECVEN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECRUN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECESP</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECECU</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOMJC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOSER</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOSRC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOMIN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOCEX</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.APOCHI</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECARG</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.RECCOL</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.REGMIN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.LEGCHI</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.TRADUC</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.LEGEXT</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.EMEMAS</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.SALMEN</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.VISCOP</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.SERSCO</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.REGCIV</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.PRECSO</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
            center: true
        },
        {
            name: <div className="text-wrap">T.OTROS</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2) +" %",
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
export default ResumenGeneralTipi