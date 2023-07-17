import "../../css/styleLogin.css"
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import DotLoader from "react-spinners/DotLoader";
import ClockLoader from "react-spinners/ClockLoader";
import ReactEcharts from "echarts-for-react";

function ReporteClaveUnicaDashboard({ flujo }) {

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
            Llamadas_dimensionadas_a_recibir: v.llamadas_dimensionadas,
            Call_DisRecibidas: v.recibidas,
            Atendidas: v.atendidas,
            Sobre_o_bajo_tráfico: v.sobre_bajo_trafico,
            Debió_atender: v.debio_atender,
            Nivel_de_atención_esperado: v.n_atencion_e,
            Nivel_de_atención_obtenido: v.n_atencion_o,
            Ejecutivos_conectados: v.agentes,
            TMO: secondsToString(parseInt(v.tmo).toFixed(2)),
            Ejecutivos_Requeridos: v.agentes_r
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
            setData([{
                "fecha": 100,
                "llamadas_dimensionadas": 83,
                "recibidas": 87,
                "atendidas": 86,
                "sobre_bajo_trafico": 91,
                "debio_atender": 92,
                "n_atencion_e": 99,
                "n_atencion_o": 85,
                "agentes": 85,
                "TMO": 94,
                "agentes_r": 94,
                "agentes_sss": 1,
                "agentes_ras": 'Nombre 1',
                "agentes_estado": 'Ocupado',
                "agentes_tiempo": '01:23:32'
            }]);
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
            name: <div className="text-wrap">Disponible</div>,
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">Ocupado</div>,
            selector: row => row.recibidas,
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo Admin</div>,
            selector: row => row.atendidas,
            center: true
        },
        {
            name: <div className="text-wrap">No disponible</div>,
            selector: row => row.recibidas - row.atendidas, //aqui
            center: true
        },
        {
            name: <div className="text-wrap">Total</div>,
            // selector: row => (row.recibidas === '0') ? 0 : 100 * (row.atendidas / row.recibidas).toFixed(4),
            selector: row => row.atendidas - 2,
            center: true
        },
        // {
        //     name: <div className="text-wrap">Nivel servicio</div>,
        //     selector: row => (row.atendidas === '0') ? 0 : 100 * (row.llamadas_dimensionadas / row.atendidas).toFixed(4),
        //     center: true
        // },
        // {
        //     name: <div className="text-wrap">Minutos hablados</div>,
        //     selector: row => row.n_atencion_e,
        //     center: true
        // },
        // {
        //     name: <div className="text-wrap">TMO</div>,
        //     selector: row => row.tmo,
        //     center: true
        // },
        // {
        //     name: <div className="text-wrap">Tiempo espera promedio</div>,
        //     selector: row => row.agentes_r,
        //     center: true
        // }
    ];

    const columnas = [
        {
            name: <div className="text-wrap">Puesto</div>,
            selector: row => row.agentes_sss,
            center: true
        },
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => row.agentes_ras,
            center: true
        },
        {
            name: <div className="text-wrap">Estado</div>,
            selector: row => row.agentes_estado,
            center: true
        },
        {
            name: <div className="text-wrap">Tiempo</div>,
            selector: row => row.agentes_tiempo , //aqui
            center: true
        }
    ];

    const option_Ejecutivo = {
        title: {
            //   text: 'Referer of a Website',
            subtext: 'Estado',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Item 1' },
                    { value: 735, name: 'Item 2' },
                    { value: 580, name: 'Item 3' },
                    { value: 484, name: 'Item 4' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    const option_Enrolamiento = {
        title: {
            //   text: 'Referer of a Website',
            subtext: 'Enrolamiento',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Item 1' },
                    { value: 735, name: 'Item 2' },
                    { value: 580, name: 'Item 3' },
                    { value: 484, name: 'Item 4' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

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
                <div className="mt-1 row">

                    <div className="col-lg-8 col-md-12 mt-3">
                            <div className="mt-1">

                                <DataTable
                                    columns={columns}
                                    data={datafull}
                                    highlightOnHover
                                    customStyles={customStyles}

                                />
                            </div>
                            <div className="mt-3">
                        <DataTable
                            columns={columnas}
                            data={datafull}
                            highlightOnHover
                            customStyles={customStyles}

                        />
                        </div>
                        <div className="mt-3">
                        <DataTable
                            columns={columnas}
                            data={datafull}
                            highlightOnHover
                            customStyles={customStyles}

                        />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 mt-3">
                        <ReactEcharts option={option_Enrolamiento}
                            style={{ width: "400px", height: "400px" }}
                        >
                        </ReactEcharts>
                        <ReactEcharts option={option_Ejecutivo}
                            style={{ width: "400px", height: "400px" }}>
                        </ReactEcharts>


                    </div>
                </div>


            )}
        </>
    )
}
export default ReporteClaveUnicaDashboard