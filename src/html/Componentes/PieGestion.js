import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo


function PieGestion() {
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

    useEffect(() => {
        const token = getToken();
        const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"
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
        await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Panel/Gestion/Cargas', { dato: null }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then((response) => {

                var arrr = response.data;
                // console.log(arrr)
                setData(arrr)

            })

    })


    let columns = []
    let valores = []


    data.forEach((element) => {

        if (element.compromisospago !== null)
            valores.push({ value: parseInt(element.compromisospago), name: element.nombre_carga })


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
            left: 'left',
            show: false
        },
        // Add legend
        series: [{
            type: 'pie',
            left: '25%',
            top: 10,
            bottom: 30,
            width: '50%',
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
    return ( <
        >
        <
        ReactEcharts option = { option_donut }
        // style={{ width: "400px", height: "400px" }}
        >
        <
        /ReactEcharts>

        <
        />
    );
}

export default PieGestion