import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo


function Pie() {
    //funciones para mostrar los botones

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


    // const [loading, setLoading] = useState(false)   revisar loading
    // useEffect(() => {
    //     setLoading(true)
    //     // setTimeout(() => {
    //     //     setLoading(false)
    //     // }, 3000)
    // }, [])

    useEffect(() => {
        const token = getToken();
        const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"  // revisar endpoint
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(false);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(false);
            });

        Datos()

    }, []);

    const Datos = (async() => {

        axios.post("https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Agente/Live", { dato: '', dato_1: '', dato_2: '' }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then((response) => {

                var arrr = response.data;
                // console.log(arrr)
                setData(arrr)

            })

    })


    let columns = []
    let valores = []


    data.forEach((element) => {

        valores.push({ value: parseInt(element.last_call_time), name: element.status })


    });

    const option_donut = {


        // Add tooltip
        tooltip: {
            trigger: 'item'
        },

        title: {
            left: 'center',
            position: 'center'

        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        // Add legend
        series: [{
            type: 'pie',
            left: '25%',
            top: 30,
            bottom: 30,
            width: '60%',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            emphasis: {
                focus: 'self'
            },
            label: {
                formatter: (params) => params.name + '\n' + params.value + ' /' + params.percent + '%',
                show: true,
                position: "outside"
            },

            data: valores
        }]



    }
    return ( 
    <>
        <ReactEcharts option = { option_donut }
        style={{ width: "400px", height: "400px" }}>
        </ReactEcharts>


        </>
);
}

export default Pie