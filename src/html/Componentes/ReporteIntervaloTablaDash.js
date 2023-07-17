import "../../css/styleLogin.css"
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ReporteIntervaloTablaDash({ flujo }) {

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

    // const handleOnExportCarga = () => {

    //     //creates a new workbook
    //     let wb = XLSX.utils.book_new();

    //     var arr2 = datafull.map(v => ({
    //         Fecha: v.fecha,
    //         Llamadas_dimensionadas_a_recibir: v.llamadas_dimensionadas,
    //         Call_DisRecibidas: v.recibidas,
    //         Atendidas: v.atendidas,
    //         Sobre_o_bajo_tráfico: v.sobre_bajo_trafico,
    //         Debió_atender: v.debio_atender,
    //         Nivel_de_atención_esperado: v.n_atencion_e,
    //         Nivel_de_atención_obtenido: v.n_atencion_o,
    //         Ejecutivos_conectados: v.agentes,
    //         TMO: secondsToString(parseInt(v.tmo).toFixed(2)),
    //         Ejecutivos_Requeridos: v.agentes_r
    //     }));

    //     let ws = XLSX.utils.json_to_sheet(arr2);
    //     var today = new Date()
    //     let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    //     XLSX.utils.book_append_sheet(wb, ws, "Carga");
    //     XLSX.writeFile(wb, "Gestion_Carga_" + date + ".xlsx");
    // };

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000)
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado',
            { dato: flujo },
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
                minHeight: '50px', // override the row height
                maxHeight: '60px',
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
                fontSize: '20px',


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
            selector: row => row.recibidas - row.atendidas, 
            center: true
        },
        {
            name: <div className="text-wrap">Nivel Atención</div>,
            selector: row => (row.recibidas === '0') ? 0 : parseFloat(100 * (row.atendidas / row.recibidas)).toFixed(2)+"%",
            center: true
        },
        {
            name: <div className="text-wrap">Nivel Servicio</div>,
            selector: row => (row.atendidas === '0') ? 0 : parseFloat(100 * (row.llamadas_dimensionadas / row.atendidas)).toFixed(2)+"%",
            center: true
        },
        {
            name: <div className="text-wrap">Minutos Hablados</div>,
            selector: row => parseFloat(row.n_atencion_e/60).toFixed(2),
            center: true
        },
        {
            name: <div className="text-wrap">TMO</div>,
            selector: row =>parseFloat(row.tmo/60).toFixed(2),
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo Espera Promedio</div>,
            selector: row =>   parseFloat(row.agentes_r).toFixed(2),
            center: true
        }
    ];



    return (
        <>

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

                    <DataTable
                        columns={columns}
                        data={datafull}
                        highlightOnHover
                        customStyles={customStyles}
                    />
                </div>
            )}
        </>
    )
}
export default ReporteIntervaloTablaDash