import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";
import ReactEcharts from "echarts-for-react";
import { parse } from 'date-fns';

function ResumenRepoEpa({ flujo, campana, ini, fin }) {

    const [data, setDatapie] = useState([]);
    const [datafull, setData] = useState([]);
    const [datafull0, setData0] = useState([]);
    const [dataEpa1, setDataEpa1] = useState([]);
    const [dataEpa2, setDataEpa2] = useState([]);
    const [dataEpa3, setDataEpa3] = useState([]);

    const [dataEpa1_st, setDataEpa1_st] = useState([]);
    const [dataEpa2_st, setDataEpa2_st] = useState([]);
    const [dataEpa3_st, setDataEpa3_st] = useState([]);

    const [dataEpa1_g, setDataEpa1G] = useState([]);
    const [dataEpa2_g, setDataEpa2G] = useState([]);
    const [dataEpa3_g, setDataEpa3G] = useState([]);


    const [dataTotals1, setdataTotals1] = useState([]);
    const [dataMes, setDataMes] = useState([]);
    const [datafull_encuestas, setDataEncuestas] = useState([]);
    const [datafull_encuestas_resumen, setDataEncuestasResumen] = useState([]);

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

        var arr1 = dataEpa1.map(v => ({
            // Fecha: v.fecha,
            Solucion: v.value,
            Cantidad: v.count,
            // Porcentaje: v.porcentaje, //revisar

        }));

        var arr2 = dataEpa2.map(v => ({
            // Fecha: v.fecha,
            Solucion: v.value,
            Cantidad: v.count,
            // Porcentaje: v.porcentaje,

        }));

        var arr3 = dataEpa3.map(v => ({
            // Fecha: v.fecha,
            Solucion: v.value,
            Cantidad: v.count,
            // Porcentaje: v.porcentaje,
        }));

        var arr4 = datafull_encuestas.map(v => ({
            Indice: v.indice,
            Id_agente: v.iD_AGENTE,
            Agente: v.nombre,//aqui
            Fecha: v.fecha,
            Hora: v.hora,
            Telefono: v.telefono,
            Pregunta_1: v.preguntA_01,
            Pregunta_2: v.preguntA_02,
            Pregunta_3: v.preguntA_03,
            Corte: v.cortE_LLAMADO,
        }));

        let ws = XLSX.utils.json_to_sheet(arr1);
        let ws1 = XLSX.utils.json_to_sheet(arr2);
        let ws2 = XLSX.utils.json_to_sheet(arr3);
        let ws3 = XLSX.utils.json_to_sheet(arr4);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Epa1");
        XLSX.utils.book_append_sheet(wb, ws1, "Epa2");
        XLSX.utils.book_append_sheet(wb, ws2, "Epa3");
        XLSX.utils.book_append_sheet(wb, ws3, "Detalle");
        XLSX.writeFile(wb, "Epa" + date + ".xlsx");
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

        //primera tabla

        Datos_Canales()  //tabla de detalle registros
        Datos_Canales_Resumen()
    }, []);


    //datos grafico barras

    let columnsBarras_epa2 = []
    let cantidad_epa2 = []
    dataEpa2_g.forEach((element) => {

        cantidad_epa2.push(parseInt(element.count))
        columnsBarras_epa2.push(element.value)
    });

    const option_multibar_epa2 = {

        grid: {
            x: 60,
            x2:40,
            y: 35,
            y2: 25
        },

        // Add tooltip
        tooltip: {
            trigger: 'axis'
        },

        // Add legend
        // legend: {
        //     data: ['Pregunta 2']
        // },
        toolbox: {
            show: true,

        },
        // Add custom colors
        color: ['#666EE8'],

        // Enable drag recalculate
        calculable: true,

        // Horizontal axis
        xAxis: [{
            type: 'category',
            data: columnsBarras_epa2,
        }],

        // Vertical axis
        yAxis: [{
            type: 'value',
            min: 0,
            max: function (value) {
                return value.max + 5;
            },
            name: 'Cantidad'
        }],

        // Add series
        series: [{
            // name: 'Pregunta 2',
            type: 'bar',
            data: cantidad_epa2,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontWeight: 500
                        }
                    }
                }
            }
        }
        ]


    }

    let columnsBarras_epa3 = []
    let cantidad_epa3 = []
    dataEpa3_g.forEach((element) => {

        cantidad_epa3.push(parseInt(element.count))
        columnsBarras_epa3.push(element.value)
    });

    const option_multibar_epa3 = {

        grid: {
            x: 60,
            x2:40,
            y: 35,
            y2: 25
        },

        // Add tooltip
        tooltip: {
            trigger: 'axis'
        },

        // Add legend
        // legend: {
        //     data: ['Pregunta 3']
        // },
        toolbox: {
            show: true,

        },
        // Add custom colors
        color: ['#666EE8'],

        // Enable drag recalculate
        calculable: true,

        // Horizontal axis
        xAxis: [{
            type: 'category',
            data: columnsBarras_epa3,
        }],

        // Vertical axis
        yAxis: [{
            type: 'value',
            min: 0,
            max: function (value) {
                return value.max + 5;
            },
            name: 'Cantidad'
        }],

        // Add series
        series: [{
            // name: 'Pregunta 3',
            type: 'bar',
            data: cantidad_epa3,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            fontWeight: 500
                        }
                    }
                }
            }
        }
        ]


    }

    //datos grafico pie

    let valores = []

    dataEpa1_g.forEach((element) => {

        valores.push({ value: parseInt(element.count), name: element.value })

    });

    const option_donut = {

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
                data: valores,
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

    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += (item[key] === null) ? 0 : parseInt(item[key]);
        });
        return total;
    };

    const Datos_Canales_Resumen = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/EPA/Resumen',
            { dato: ini, dato_1: fin ,dato_2: flujo},
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)


            setDataEncuestasResumen(result.data);


            setLoading(false)
        }
        else {

            setLoading(false)
        }

    })


    const Datos_Canales = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/EPA',
            { dato: ini, dato_1: fin ,dato_2: flujo },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

          //  console.log(result.data)

            const distinctCount_1 = {};
            const distinctCount_2 = {};
            const distinctCount_3 = {};
            
            const distinctCount_1_g = {};
            const distinctCount_2_g = {};
            const distinctCount_3_g = {};

            const distinctAgente = {};

            const jsonArray = result.data

            jsonArray.forEach(obj => {
                const value1 = obj.preguntA_01;
                distinctCount_1[value1] = (distinctCount_1[value1] || 0) + 1;

                const value2 = obj.preguntA_02;
                distinctCount_2[value2] = (distinctCount_2[value2] || 0) + 1;

                const value3 = obj.preguntA_03;
                distinctCount_3[value3] = (distinctCount_3[value3] || 0) + 1;

                const value1_g = obj.preguntA_01;
                distinctCount_1_g[value1_g] = (distinctCount_1_g[value1_g] || 0) + 1;

                const value2_g = obj.preguntA_02;
                distinctCount_2_g[value2_g] = (distinctCount_2_g[value2_g] || 0) + 1;

                const value3_g = obj.preguntA_03;
                distinctCount_3_g[value3_g] = (distinctCount_3_g[value3_g] || 0) + 1;


                const value4 = obj.iD_AGENTE;
                distinctAgente[value4] = (distinctAgente[value4] || 0) + 1;


            });

            const distinctPreg_1 = Object.entries(distinctCount_1).map(([value, count]) => ({ value, count }));
            const distinctPreg_2 = Object.entries(distinctCount_2).map(([value, count]) => ({ value, count }));
            const distinctPreg_3 = Object.entries(distinctCount_3).map(([value, count]) => ({ value, count }));


            setDataEpa1_st(distinctPreg_1);
            setDataEpa2_st(distinctPreg_2);
            setDataEpa3_st(distinctPreg_3);


            const distinctPreg_1_g = Object.entries(distinctCount_1_g).map(([value, count]) => ({ value, count }));
            const distinctPreg_2_g = Object.entries(distinctCount_2_g).map(([value, count]) => ({ value, count }));
            const distinctPreg_3_g = Object.entries(distinctCount_3_g).map(([value, count]) => ({ value, count }));


            const distinctAgente_ = Object.entries(distinctAgente).map(([value, count]) => ({ value, count }));



            setDataEpa1G(distinctPreg_1_g)
            setDataEpa2G(distinctPreg_2_g)
            setDataEpa3G(distinctPreg_3_g)

            const totalepa1 = distinctPreg_1.reduce((acc, curr) => acc + parseInt(curr.count), 0);
            const totalRow1 = {
                value: 'Total',
                count: totalepa1,
            };
            const totalepa2 = distinctPreg_2.reduce((acc, curr) => acc + parseInt(curr.count), 0);
            const totalRow2 = {
                value: 'Total',
                count: totalepa2,
            };

            const totalepa3 = distinctPreg_3.reduce((acc, curr) => acc + parseInt(curr.count), 0);
            const totalRow3 = {
                value: 'Total',
                count: totalepa3,
            };


            distinctPreg_1.push(totalRow1)
            distinctPreg_2.push(totalRow2)
            distinctPreg_3.push(totalRow3)
            
            setDataEpa1(distinctPreg_1);
            setDataEpa2(distinctPreg_2);
            setDataEpa3(distinctPreg_3);

            setDataEncuestas(result.data);
            setLoading(false)
        }
        else {

            setLoading(false)
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
    const columnsEpa1 = [

        {

            name: <div className="text-wrap">Pregunta 1</div>,
            selector: row => row.value,
            center: true
        },
        {
            name: <div className="text-wrap">Cantidad</div>,
            selector: row => row.count,
            center: true
        },
        {
            name: <div className="text-wrap">%</div>,
            selector: row =>  2*((row.count / dataEpa1_st.reduce((acc, cur) => acc + cur.count, 0)) * 100).toFixed(2) + '%',
            center: true
        }

    ];
    const columnsEpa2 = [
        {
            name: <div className="text-wrap">Pregunta 2</div>,
            selector: row => row.value,
            center: true
        },
        {
            name: <div className="text-wrap">Cantidad</div>,
            selector: row => row.count,
            center: true
        },
        {
            name: <div className="text-wrap">%</div>,
            selector: row => 2*((row.count / dataEpa2_st.reduce((acc, cur) => acc + cur.count, 0)) * 100).toFixed(2) + '%',
            center: true
        }

    ];
    const columnsEpa3 = [
        {
            name: <div className="text-wrap">Pregunta 3</div>,
            selector: row => row.value,
            center: true
        },
        {
            name: <div className="text-wrap">Cantidad</div>,
            selector: row => row.count,
            center: true
        },
        {
            name: <div className="text-wrap">%</div>,
            selector: row => 2*((row.count / dataEpa3_st.reduce((acc, cur) => acc + cur.count, 0)) * 100).toFixed(2) + '%',
            center: true
        }
    ];
    const columnsEpa4 = [
        {
            name: <div className="text-wrap">Fecha</div>,
            selector: row => row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">Fue resuelto</div>,
            selector: row => row.resuelto,
            center: true
        },
        {
            name: <div className="text-wrap">No fue resuelto</div>,
            selector: row => row.noresuelto,
            center: true
        },
        {
            name: <div className="text-wrap">Pregunta 2</div>,
            selector: row => row.preg2,
            center: true
        },
        {
            name: <div className="text-wrap">Pregunta 3</div>,
            selector: row => row.preg3,
            center: true
        }


    ];
    // encuestas
    const columns_encuestas = [
        {
            name: <div className="text-wrap">Indice</div>,
            selector: row => row.indice,
            center: true
        },
        {
            name: <div className="text-wrap">Id Agente</div>,
            selector: row => row.iD_AGENTE,
            center: true
        },
        {
            name: <div className="text-wrap">Agente</div>,
            selector: row => row.nombre,
            center: true
        },
        {
            name: <div className="text-wrap">Fecha</div>,
            selector: row => (row.fecha === null) ? "-" : row.fecha,
            center: true
        },
        {
            name: <div className="text-wrap">Hora</div>,
            selector: row => (row.hora === null) ? "-" : row.hora,
            center: true
        },
        {
            name: <div className="text-wrap">Telefono</div>,
            selector: row => row.telefono,
            center: true
        },
        {
            name: <div className="text-wrap">Pregunta 1</div>,
            selector: row => row.preguntA_01,
            center: true
        },
        {
            name: <div className="text-wrap">Pregunta 2</div>,
            selector: row => row.preguntA_02,
            center: true
        },
        {
            name: <div className="text-wrap">Pregunta 3</div>,
            selector: row => row.preguntA_03,
            center: true
        },
        {
            name: <div className="text-wrap">Corte</div>,
            selector: row => row.cortE_LLAMADO,
            center: true
        }


    ];


    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resumen Encuestas Telefónicas</h4>
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
                                    <div className=" mt-2">
                                        <div className='row d-flex float-start'>
                                            <section className=" float-start mb-2">
                                                <button
                                                    onClick={handleOnExportCarga}
                                                    className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                                    <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                                </button>
                                            </section>
                                        </div>
                                        <div className='row col-12'>
                                            <div className='card col'>
                                                ¿Su consulta fue resuelta?
                                                <DataTable
                                                    columns={columnsEpa1}
                                                    data={dataEpa1}
                                                    customStyles={customStyles}
                                                    striped
                                                />
                                                <ReactEcharts option={option_donut} className="mt-3">
                                                </ReactEcharts>
                                            </div>
                                            <div className='card col ms-3'>

                                                ¿Cómo evaluaría la atención del ejecutivo?
                                                <DataTable
                                                    columns={columnsEpa2}
                                                    data={dataEpa2}
                                                    customStyles={customStyles}
                                                    striped />
                                                <ReactEcharts option={option_multibar_epa2} className="mt-3">
                                                </ReactEcharts>
                                            </div>
                                            <div className='card col ms-3'>
                                                ¿Qué nota le asignaría al servicio entregado por el SRCEI?
                                                <DataTable
                                                    columns={columnsEpa3}
                                                    data={dataEpa3}
                                                    customStyles={customStyles}
                                                    striped
                                                />


                                                <ReactEcharts option={option_multibar_epa3} className="mt-3" >
                                                </ReactEcharts>
                                            </div>
                                        </div>

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
                                <h4 className="my-0 font-weight-normal">Valores Promedios</h4>
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
                                    <div className="mt-5"  >

                                        <DataTable
                                            columns={columnsEpa4}
                                            data={datafull_encuestas_resumen}
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
                                    <div className="mt-5"  >

                                        <DataTable
                                            columns={columns_encuestas}
                                            data={datafull_encuestas}
                                            customStyles={customStyles}
                                            striped
                                            pagination
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
export default ResumenRepoEpa