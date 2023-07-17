import "../../css/styleLogin.css"
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactEcharts from "echarts-for-react";
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function PieAcumulado() {

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


  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

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

  const Datos = (async () => {

    const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/IVR',
      { dato: 9999 },
      { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

    if (result.status === 200) {

      console.log(result.data)
      setLoading(false)
      setData(result.data);
      // setData([{
      //     "fecha": "3/18/2022",
      //     "llamadas_dimensionadas": 83,
      //     "recibidas": 87,
      //     "atendidas": 86,
      //     "sobre_bajo_trafico": 91,
      //     "debio_atender": 92,
      //     "n_atencion_e": 99,
      //     "n_atencion_o": 85,
      //     "agentes": 85,
      //     "TMO": 94,
      //     "agentes_r": 94
      //   }]);
    }
    else {
      setLoading(false)
    }

  })


  let columns = []
  let valores = []
  let valoresunico = []


  data.forEach((element) => {

    if (element.origen === 'IVR_PRINCIPAL') {

      valores.push({ value: parseInt(element.cantidad), name: element.ivr })
    }
    else if (element.origen === 'IVR_CLAVEUNICA') {
      valoresunico.push({ value: parseInt(element.cantidad), name: element.ivr })
    }
    else {

    }


  });



  const option_pie_principal = {
    title: {
      //   text: 'Referer of a Website',
      subtext: 'IVR PRINCIPAL',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
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

  const option_pie_unico = {
    title: {
      //   text: 'Referer of a Website',
      subtext: 'CLAVE UNICA',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
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
        formatter: (params2) => params2.name + '\n' + params2.value + ' /' + params2.percent + '%',
        show: true,
        position: "outside"
      },
      data: valoresunico
    }]
  }


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
        <div className="mt-1">
          <div className="row">
            <div className="col-5">  <ReactEcharts option={option_pie_principal}></ReactEcharts>
            </div>
            <div className="col-5 ms-3">  <ReactEcharts option={option_pie_unico}></ReactEcharts>
            </div>

          </div>

        </div>
      )}

    </>
  )
}
export default PieAcumulado