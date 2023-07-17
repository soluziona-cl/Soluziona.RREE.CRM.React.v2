import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ReporteTipificadasAgenteTabla({ flujo, ini, fin, nombre }) {

    const [datafull, setData] = useState([]);
    const [datafull2, setData2] = useState([]);
    const [datafull3, setData3] = useState([]);


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
            Nombres_o_Razón_Social_Empresa: v.nombresorazonsocialempresa,
            Apellido_Paterno: v.apellidopaterno,
            Apellido_Materno: v.apellidomaterno,
            Rut: v.rut,
            DV: v.dv,
            Telefono: v.telefono,
          
        }));
        var arr3 = datafull2.map(v => ({
            Nombres_o_Razón_Social_Empresa: v.nombresorazonsocialempresa,
            Apellido_Paterno: v.apellidopaterno,
            Apellido_Materno: v.apellidomaterno,
            Rut: v.rut,
            DV: v.dv,
            Telefono: v.telefono,
          
        }));
        var arr4 = datafull3.map(v => ({
            Nombres_o_Razón_Social_Empresa: v.nombresorazonsocialempresa,
            Apellido_Paterno: v.apellidopaterno,
            Apellido_Materno: v.apellidomaterno,
            Rut: v.rut,
            DV: v.dv,
            Telefono: v.telefono,
          
        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        let ws1 = XLSX.utils.json_to_sheet(arr3);
        let ws2 = XLSX.utils.json_to_sheet(arr4);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Reporte_Efecto_Transferencia1");
        XLSX.utils.book_append_sheet(wb, ws1, "Reporte_Efecto_Transferencia2");
        XLSX.utils.book_append_sheet(wb, ws2, "Reporte_Efecto_Transferencia3");
        XLSX.writeFile(wb, "Reporte_Efectividad_Transferencia" + date + ".xlsx");
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
Datos2()
        Datos3()

    }, []);

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/FLujo/Transferencias/Intervalo',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData(result.data);
            setLoading(false)
        }
else{setLoading(false)}
    })
    const Datos2 = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/FLujo/Transferencias/Origen/Final',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData2(result.data);
            setLoading(false)
        }
else{setLoading(false)}
    })

    // ok
    const Datos3 = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/FLujo/Transferencias/Intervalo',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData3(result.data);
            setLoading(false)
        }
else{setLoading(false)}
    })

    const customStyles = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '80px',
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
                fontSize: '14px',

            },

        },

    };
    const columns = [
        {
            name: <div className="text-wrap">Intervalo</div>,
            selector: row => row.intervalo,
            center: true
        },
        {
            name: <div className="text-wrap">Transferencias</div>,
            selector: row => row.transferido,
            center: true
        }
    
    ];

    const columns2 = [
        {
            name: <div className="text-wrap">Origen</div>,
            selector: row => row.origen,
            center: true
        },
        {
            name: <div className="text-wrap">Final</div>,
            selector: row => row.final,
            center: true
        }
        ,
        {
            name: <div className="text-wrap">Transferidas</div>,
            selector: row => row.transferidas,
            center: true
        }
    
    ];

    // ok
    const columnsfull = [
        {
            name: <div className="text-wrap">Intervalo</div>,
            selector: row => row.intervalo,
            center: true
        },
        {
            name: <div className="text-wrap">Transferencias</div>,
            selector: row => row.transferido,
            center: true
        }
    
    ];
    


    return (
        <>
       {/* <div className="row"> */}
                {/* <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Información Diaria</h4>
                            </div>
                            <div className="card-body">
                                <section className=" float-start mb-2">
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

                </div> */}

            {/* </div> */}
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal"> Transferencias Origen Final</h4>
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
                                    <div className="mt-2">
                                         <section className=" float-start">
                                <button
                                    onClick={handleOnExportCarga}
                                    className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                    <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                </button>
                            </section>
                                        <DataTable
                                            columns={columns2}
                                            data={datafull2}
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
                                <h4 className="my-0 font-weight-normal">Transferencias Por Intervalos</h4>
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
                                            columns={columnsfull}
                                            data={datafull3}
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
export default ReporteTipificadasAgenteTabla