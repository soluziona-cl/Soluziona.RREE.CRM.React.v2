import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import ClockLoader from "react-spinners/ClockLoader";

//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo

function GraficoAcumuladoMensual({ flujo, periodo, nombre }) {
    //funciones para mostrar los botones

    const [data, setData] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [loading, setLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };
    // const [valores, setValores] = useState([]);
    // const [columns, setColumns] = useState([])

    //DataTable, inyectando la data en las columnas

    // Using useEffect to call the API once mounted and set the data
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


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado/Reporte/Mes',
            { dato: flujo, dato_1: periodo },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)

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
        }

    })

    let columns = []
    let recibidas = []
    let contestadas = []
    let abandonadas = []

    data.forEach((element) => {

        recibidas.push(parseInt(element.recibidas))
        contestadas.push(parseInt(element.atendidas))
        abandonadas.push(parseInt(element.recibidas - element.atendidas))
        columns.push(element.fecha)
    });


    console.log(columns)
    console.log(recibidas)
    console.log(contestadas)
    console.log(abandonadas)


    // const options = {
    //     grid: { top: 20, right: 40, bottom: 20, left: 40 },
    //     xAxis: {
    //         type: "category",
    //         data: columns
    //     },
    //     yAxis: {
    //         type: "value"
    //     },
    //     series: [
    //         {
    //             data: valores,
    //             type: "bar",
    //             smooth: true
    //         }
    //     ],
    //     tooltip: {
    //         trigger: "axis"
    //     }
    // }

    const opction_multibar = {

        grid: {
            x: 60,
            x2:40,
            y: 75,
            y2: 25
        },


        // Add tooltip
        tooltip: {
            trigger: 'axis'
        },

        // Add legend
        legend: {
            padding: 15,
            data: ['Ingresadas', 'Atendidas', 'Abandonadas']
        },
        toolbox: {
            show: true,

        },


        // Add custom colors
        color: ['#666EE8', '#20A464', '#FF4961'],

        // Enable drag recalculate
        calculable: true,

        // Horizontal axis
        xAxis: [{
            type: 'category',
            data: columns,
        }],

        // Vertical axis
        yAxis: [{
            type: 'value',
            min: 0,
            max: function (value) {
                return value.max + 20;
            },
            name: 'Cantidad'
        }],

        // Add series
        series: [{
            name: 'Ingresadas',
            type: 'bar',
            data: recibidas,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontWeight: 500
                        }
                    }
                }
            },
            markPoint: {
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            },
            markLine: {
                data: [{ type: 'average', name: 'Promedio' }]
            }
        },
        {
            name: 'Atendidas',
            type: 'bar',
            data: contestadas,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontWeight: 500
                        }
                    }
                }
            },
            markPoint: {
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            },
            markLine: {
                data: [{ type: 'average', name: 'Promedio' }]
            }
        },
        {
            name: 'Abandonadas',
            type: 'bar',
            data: abandonadas,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontWeight: 500
                        }
                    }
                }
            },
            markPoint: {
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            },
            markLine: {
                data: [{ type: 'average', name: 'Promedio' }]
            }
        }
        ]


    }
    return (
        <>
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Comportamiento Servicio</h4>
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

                                        <ReactEcharts
                                            option={opction_multibar}
                                        // style={{ width: "80rem", height: "30rem" }}
                                        ></ReactEcharts>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>


        </>
    );
}

export default GraficoAcumuladoMensual