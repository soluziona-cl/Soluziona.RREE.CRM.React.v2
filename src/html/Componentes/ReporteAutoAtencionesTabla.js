import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import DotLoader from "react-spinners/DotLoader";



function ReporteAutoAtencionesTabla({ flujo, periodo, nombre }) {


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
            Mes:v.mes,
            Auto_atención_Licencias_Médicas:v.licencia,
            Auto_atención_Saldo_Favor:v.saldo,
            Fecha_y_lugar_de_pago_pensión:v.pagopension,
            Apertura_y_horario_de_atención_Sucursales:v.sucursales,
            Horario_de_atención_Call_Center_FH:v.callcenter,
            Cambio_forma_de_pago:v.formapago,
            Deriva_Prepago:v.derivaprepago,
            Grabación_de_Parques:v.parques,
            Info_Crédito_vigente:v.creditovigente,
            Bono_Gobierno_Deriva_101:v.bonogobierno,
            TAM:v.tam,
            Autorización_para_pagos_de_LM_con_transferencias_electrónicas:v.transferencia,
            AFA_Estado:v.afaestado,
            AFA_documentos:v.afadocumentos,
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/AutoAtencion',
            { dato: flujo, dato_1: periodo },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)

            result.data.push({
                mes: "Acum.",
                licencia: getTotals(result.data, "licencia"),
                saldo: getTotals(result.data, "saldo"),
                pagopension: getTotals(result.data, "pagopension"),
                sucursales: getTotals(result.data, "sucursales"),
                callcenter:  getTotals(result.data, "callcenter"),
                formapago:  getTotals(result.data, "formapago"),
                derivaprepago:  getTotals(result.data, "derivaprepago"),
                parques: getTotals(result.data, "parques"),
                creditovigente: getTotals(result.data, "creditovigente"),
                bonogobierno: getTotals(result.data, "bonogobierno"),
                tam: getTotals(result.data, "tam"),
                transferencia: getTotals(result.data, "transferencia"),
                afaestado: getTotals(result.data, "afaestado"),
                afadocumentos: getTotals(result.data, "afadocumentos"),
            });

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
            name: <div className="text-wrap">Mes</div>,
            selector: row => row.mes,
            center: true
        },
        {
            name: <div className="text-wrap">Auto atención Licencias Médicas</div>,
            selector: row => row.licencia,
            center: true
        },
        {
            name: <div className="text-wrap">Auto atención Saldo Favor</div>,
            selector: row => row.saldo,
            center: true
        },
        {
            name: <div className="text-wrap">Fecha y lugar de pago pensión</div>,
            selector: row => row.pagopension,
            center: true
        },
        {
            name: <div className="text-wrap">Apertura y horario de atención Sucursales</div>,
            selector: row => row.sucursales,
            center: true
        },
        {
            name: <div className="text-wrap">Horario de atención Call Center FH</div>,
            selector: row => row.callcenter,
            center: true
        },
        {
            name: <div className="text-wrap">Cambio forma de pago</div>,
            selector: row => row.formapago,
            center: true
        },
        {
            name: <div className="text-wrap">Deriva Prepago</div>,
            selector: row => row.derivaprepago,
            center: true
        },
        {
            name: <div className="text-wrap">Grabación de Parques</div>,
            selector: row => row.parques,
            center: true
        },
        {
            name: <div className="text-wrap">Info. Crédito vigente</div>,
            selector: row => row.creditovigente,
            center: true
        },
        {
            name: <div className="text-wrap">Bono Gobierno Deriva (101)</div>,
            selector: row => row.bonogobierno,
            center: true
        },
        {
            name: <div className="text-wrap">TAM</div>,
            selector: row => row.tam,
            center: true
        },
        {
            name: <div className="text-wrap">Autorización para pagos de LM con transferencias electrónicas</div>,
            selector: row => row.transferencia,
            center: true
        },
        {
            name: <div className="text-wrap">AFA Estado</div>,
            selector: row => row.afaestado,
            center: true
        },
        {
            name: <div className="text-wrap">AFA documentos</div>,
            selector: row => row.afadocumentos,
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
                                <h4 className="my-0 font-weight-normal">Resumen Diario {periodo} - {nombre}</h4>
                            </div>
                            <div className="card-body">
                                <section className=" float-start">
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
export default ReporteAutoAtencionesTabla