import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import ClockLoader from "react-spinners/ClockLoader";

//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo

function GraficoResumenDiario({ flujo, campana, ini, fin }) {
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
      
    }, []);

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado/Reporte',
            { dato: flujo, dato_1: ini, dato_2: fin },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)

            setData(result.data);
            setLoading(false)
        }
else{
    setLoading(false)
}
    })

    let columns = []
    let recibidas = []
    let contestadas = []
    let abandonadas = []

    let natencion = []
    let nservicio = []

    data.forEach((element) => {

        recibidas.push(parseInt(element.recibidas))
        contestadas.push(parseInt(element.atendidas))
        abandonadas.push(parseInt(element.recibidas - element.atendidas))
        natencion.push(100*(element.atendidas/element.recibidas).toFixed(4))
        nservicio.push(100*(element.llamadas_dimensionadas/element.atendidas).toFixed(4))
        columns.push(element.fecha)
    });


    console.log(columns)
    console.log(recibidas)
    console.log(contestadas)
    console.log(abandonadas)
    console.log(natencion)
    console.log(nservicio)



    const opction_multibar = {
        grid: {
            x: 60,
            x2:40,
            y: 75,
            y2: 25
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['Atendidas', 'Abandonadas', 'Nivel Atencion', 'Nivel Servicio']
        },
        xAxis: [
            {
                type: 'category',
                data: columns,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Q',
                min: 0,
                max: function (value) {
                    return value.max + 20;
                }
            },
            {
                type: 'value',
                name: '%',
                min: 0,
                max: 100
            }
        ],
        series: [
            {
                name: 'Atendidas',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' ';
                    }
                },
                data: contestadas
            },
            {
                name: 'Abandonadas',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' ';
                    }
                },
                data: abandonadas
            },
            {
                name: 'Nivel Atencion',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return parseFloat(value).toFixed(2) + ' %';
                    }
                },
                data:natencion
            }
            ,
            {
                name: 'Nivel Servicio',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' %';
                    }
                },
                data: nservicio
            }
        ]
    };
    return (
        <>
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Detalle Diario Tráfico</h4>
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

export default GraficoResumenDiario