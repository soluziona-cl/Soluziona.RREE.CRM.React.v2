import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import * as echarts from 'echarts';
//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo


// import 'animate.css';

function Donut() {
    //funciones para mostrar los botones

    const [data, setData] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    // const [valores, setValores] = useState([]);
    // const [columns, setColumns] = useState([])

    //DataTable, inyectando la data en las columnas

    // Using useEffect to call the API once mounted and set the data
    useEffect(() => {
        axios.post("https://app.soluziona.cl/API_desa/Soluziona.Dashboard.Salcobrand/api/Contact_CRM/CRM/Trafico/Inbound/Full")
            .then((response) => {

                var arrr = response.data;
                // console.log(arrr)
                setData(arrr)

            })

    }, []);

    let columns = []
    let valores = []
    let valores_rec = {}
    let valores_cont = {}
    let valores_aba = {}
    let valores_fue = {}



    data.forEach((element) => {
        let title = "value";
        let valor = element.recibidas;
        valores_rec[title] = valor;
        valores_rec[title] = valor;
        title = "name";
        valor = "Recibidas";
        valores_rec[title] = valor;
    });

    data.forEach((element) => {
        let title = "value";
        let valor = element.contestadas;
        valores_cont[title] = valor;
        valores_cont[title] = valor;
        title = "name";
        valor = "Contestadas";
        valores_cont[title] = valor;

    });

    data.forEach((element) => {
        let title = "value";
        let valor = element.abandonadas;
        valores_aba[title] = valor;
        valores_aba[title] = valor;
        title = "name";
        valor = "Abandonadas";
        valores_aba[title] = valor;

    });

    data.forEach((element) => {
        let title = "value";
        let valor = element.fuerahorario;
        valores_fue[title] = valor;
        valores_fue[title] = valor;
        title = "name";
        valor = "Fuera de Horario";
        valores_fue[title] = valor;

    });

    valores.push(valores_rec)
    valores.push(valores_cont)
    valores.push(valores_aba)
    valores.push(valores_fue)

    const option_donut = {

        // Add tooltip
        tooltip: {
            trigger: 'item'
        },
        
            // title: {
            //   text: 'Tráfico',
            //   left: 'center',
            //   position: 'center'
            
            // },
        // Add legend
        series: [
            {
                
                name: 'Llamadas',
                type: 'pie',
                left: '25%',
                top: 60,
                bottom: 60,
                width: '60%',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                emphasis: {
                    focus: 'self'
                },
                label: {
                    formatter: (params) => params.name +'\n' + params.value +' /' + params.percent+'%',
                    show: true,
                    position: "outside"
                  },

                data: valores
            }
        ]



    }
    return (
        <>
            <ReactEcharts
                option={option_donut}
                // style={{ width: "54rem", height: "54rem" }}
            ></ReactEcharts>

        </>
    );
}

export default Donut