import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';

//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo

function Intervalo_Gestion_Hoy() {

    const [data, setData] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };

    useEffect(() => {
        const token = getToken();

        const rutaservidor = "/Orkesta/Procollect/CRM"  //revisar Endpoint
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Session_Check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(false);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(false);
            });

        Datos()

    }, []);

    const Datos = (async () => {

        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Soluziona/RREE/api/Contact_CRM/CRM/Panel/Inbound/Intervalo/Now',
            { dato: 1000 },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then((response) => {

                var arrr = response.data;
                // console.log(arrr)
                setData(arrr)

            })

    })

    let columns = []
    let recibidas = []
    let contestadas = []
    let acepta = []

    data.forEach((element) => {

        recibidas.push(parseInt(element.recibidas))
        contestadas.push(parseInt(element.contestadas))
        acepta.push(parseInt(element.abandonadas))
        columns.push(element.intervalo)
    });

    const opction_multibar = {

        grid: {
            x: 40,
            x2: 40,
            y: 35,
            y2: 25
        },

        // Add tooltip
        tooltip: {
            trigger: 'axis'
        },

        // Add legend
        legend: {
            data: ['Ingresadas', 'Atendidas', 'Abandonadas']
        },
        toolbox: {
            show: true,

        },


        // Add custom colors
        color: ['#666EE8', '#20A464', '#f44336'],

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
            max: 25,
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
            data: acepta,
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
    return (<>
        <div className="card-header">
            <h4 className="my-0 font-weight-normal">Intervalo Gestion Hoy </h4>
        </div>
        <ReactEcharts option={opction_multibar}
        // style={{ width: "80rem", height: "30rem" }}
        >
        </ReactEcharts>

    </>
    );
}

export default Intervalo_Gestion_Hoy