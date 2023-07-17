import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo

function Grafico() {
    //funciones para mostrar los botones

    const [data, setData] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    // const [valores, setValores] = useState([]);
    // const [columns, setColumns] = useState([])

    //DataTable, inyectando la data en las columnas

    // Using useEffect to call the API once mounted and set the data
    useEffect(() => {
        axios.post("https://app.soluziona.cl/API_desa/Soluziona.Dashboard.Salcobrand/api/Contact_CRM/CRM/Trafico/Inbound/Intervalo")
            .then((response) => {

                var arrr = response.data;
                // console.log(arrr)
                setData(arrr)

            })

    }, []);

    let columns = []
    let recibidas = []
    let contestadas = []
    let abandonadas = []

    data.forEach((element) => {

        recibidas.push(parseInt(element.recibidas))
        contestadas.push(parseInt(element.contestadas))
        abandonadas.push(parseInt(element.abandonadas))
        columns.push(element.intervalo)
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
        color: ['#666EE8', '#20A464','#FF4961'],

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
            max: 5,
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
            <ReactEcharts
                option={opction_multibar}
                // style={{ width: "80rem", height: "30rem" }}
            ></ReactEcharts>

        </>
    );
}

export default Grafico