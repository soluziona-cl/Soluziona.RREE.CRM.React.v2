import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import ReactEcharts from "echarts-for-react";
import {
  getToken,
  removeUserSession,
  setUserSession,
} from "./Componentes/Common";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClockLoader from "react-spinners/ClockLoader";
import axios from "axios";
import "animate.css";

function DashChat({ flujo }) {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [key, setKey] = useState("trafico");
  const [datafull, setData] = useState([]);
  const [data, setDatapie] = useState([]);
  const [mostrarGrid, setMostrarGrid] = useState(true);
  const [mostrarGrid2, setMostrarGrid2] = useState(false);
  const [mostrarGrid3, setMostrarGrid3] = useState(false);

  const [company, setStartCompany] = useState("0");
  const [campana, setStartCampana] = useState("0");

  const sesiones = {
    sgui: localStorage.getItem("localgui"),
    scliente: localStorage.getItem("localcliente"),
    sid: localStorage.getItem("localid"),
    sid_usuario: localStorage.getItem("localid_usuario"),
    stoken: localStorage.getItem("token"),
  };

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const token = getToken();
    const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM";
    if (!token) {
      // console.log('Vacio')
      navigate(rutaservidor);
      return;
    }

    axios
      .post(
        "https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check",
        { user: sesiones.sid_usuario, gui: sesiones.sgui },
        { headers: { Authorization: `Bearer ${sesiones.stoken}` } }
      )
      .then((response) => {
        setUserSession(sesiones.sgui, sesiones.sid_usuario);
        setAuthLoading(true);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(true);
      });

    Datos();
    Datospie()
    DatosBarras()
  }, []);

  const Datos = async () => {
    const result = await axios.post(
      "https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Acumulado",
      { dato: flujo },
      { headers: { Authorization: `Bearer ${sesiones.stoken}` } }
    );

    if (result.status === 200) {
      console.log(result.data);
      setData(result.data);
    }
    // else{
    //     setLoading(false)
    // }
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "50px", // override the row height
        maxHeight: "60px",
        border: "2px solid #a9dff0",
        borderRadius: "3px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        backgroundColor: "#a9dff0",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
        fontSize: "20px",
      },
    },
  };

  const columns1 = [
    {
      name: <div className="text-wrap">ChatBot T</div>,
      selector: (row) => row.fecha,
      center: true,
    },
    {
      name: <div className="text-wrap">Agente Chat T</div>,
      selector: (row) => row.recibidas,
      center: true,
    },
    {
      name: <div className="text-wrap">ChatBot U</div>,
      selector: (row) => row.atendidas,
      center: true,
    },
    {
      name: <div className="text-wrap">Agente Chat U</div>,
      selector: (row) => row.recibidas - row.atendidas, //aqui
      center: true,
    },
  ];
  const columns = [
    {
      name: <div className="text-wrap">Disponible</div>,
      selector: (row) => row.fecha,
      center: true,
    },
    {
      name: <div className="text-wrap">Ocupado</div>,
      selector: (row) => row.recibidas,
      center: true,
    },
    {
      name: <div className="text-wrap">Tiempo Admin</div>,
      selector: (row) => row.atendidas,
      center: true,
    },
    {
      name: <div className="text-wrap">No Disponible</div>,
      selector: (row) => row.recibidas - row.atendidas, //aqui
      center: true,
    },
    {
      name: <div className="text-wrap">Total</div>,
      selector: (row) => row.recibidas - row.atendidas, //aqui
      center: true,
    },
  ];


  const columnsfull = [
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
      selector: row => row.agentes_tiempo, //aqui
      center: true
    }
  ];



  //datos grafico barras
  const DatosBarras = (async () => {

    const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Intervalo/Detalle',
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
      // setData([
      //     {"intervalo":"08:30","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"09:00","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"09:30","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"10:00","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"10:30","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"11:00","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"11:30","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"12:00","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"12:30","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94},
      //     {"intervalo":"13:00","llamadas_dimensionadas":83,"recibidas":87,"atendidas":86,"sobre_bajo_trafico":91,"debio_atender":92,"n_atencion_e":99,"n_atencion_o":85,"agentes":85,"TMO":94,"agentes_r":94}

      //     ]);
    }
    // else{
    //     setLoading(true)
    // }
  })

  let columnsBarras = []
  let recibidas = []
  data.forEach((element) => {

    recibidas.push(parseInt(element.tmo))
    columnsBarras.push(element.intervalo)
  });

  const option_multibar = {
    dataset: [
      {
        dimensions: ['name', 'age', 'profession', 'score', 'date'],
        source: [
          //   ['Otros ', 41, 'Engineer',  '-', '2011-02-12'],
          ['Item 7', 20, 'Teacher', 351, '2011-03-01'],
          ['Item 6 ', 52, 'Musician', 287, '2011-02-14'],
          ['Item 5', 37, 'Teacher', 219, '2011-02-18'],
          ['Item 4', 25, 'Engineer', 253, '2011-04-02'],
          ['Item 3', 71, 'Engineer', 165, '2011-03-19'],
          ['ITem 2', 36, 'Musician', 318, '2011-02-24'],
          ['Item 1', 67, 'Engineer', 366, '2011-03-12']

        ]
      },
      {
        transform: {
          type: 'sort',
          color: ['#666EE8', '#20A464', '#FFFF00', '#f00', '#ed2939', '#002a8f', '#ef2b2d', '#000', ''],

          config: { dimension: 'score', order: 'desc' }
        }
      }
    ],
    toolbox: {
      feature: {
      //   dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
      //   restore: { show: true },
      //   saveAsImage: { show: true }
      }
    },
    xAxis: {

      type: 'category',
      axisLabel: { interval: 0, rotate: 30 }
    },

    yAxis: {},
    series: {
      type: 'bar',
      encode: { x: 'name', y: 'score' },
      datasetIndex: 1
    }
  };


  //datos grafico pie
  const Datospie = (async () => {

    axios.post("https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Agente/Live", { dato: '', dato_1: '', dato_2: '' }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
      .then((response) => {

        var arrr = response.data;
        // console.log(arrr)
        setDatapie(arrr)

      })

  })
  let columnspie = []
  let valores = []


  data.forEach((element) => {

    valores.push({ value: parseInt(element.last_call_time), name: element.status })


  });

  const option_donut = {
    title: {
      //   text: 'Referer of a Website',
      subtext: 'Data Ejemplo',
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
          { value: 484, name: 'Item 4' },
          { value: 300, name: 'Item 5' }
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
      <ToastContainer autoClose={3000} />

      {loading ? (
        <div className="d-flex justify-content-center mt-3">
          <ClockLoader
            className="loading"
            color={"#5b198ab5"}
            loading={loading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="row animate__animated animate__slideInRight">
              <div className="col-12">
                <div className="row mb-2 text-center">
                  <div className="col-sm-12 col-lg-12">
                    <div className="col-sm-12 col-lg-12 card mb-4 rounded-3 shadow-sm">
                      <div className="card-header">
                        <h4 className="my-0 font-weight-normal"> Chat </h4>{" "}
                      </div>

                      <div className="row card-body">
                        <div className="col-6">
                          <DataTable
                            className="mt-2 mb-4"
                            columns={columns1}
                            data={datafull}
                            // highlightOnHover
                            customStyles={customStyles}
                          />

                          <DataTable
                            className="mb-4"
                            columns={columns}
                            data={datafull}
                            // highlightOnHover
                            customStyles={customStyles}
                          />

                          <DataTable
                            className="mb-3"
                            columns={columnsfull}
                            data={datafull}
                            // highlightOnHover
                            customStyles={customStyles}
                          />
                        </div>
                        <div className="col-6">
                          {/* <TablaChat flujo={campana} > </TablaChat> */}
                          <ReactEcharts option={option_multibar}
                          >
                          </ReactEcharts>

                          <ReactEcharts option={option_donut}
                          >
                          </ReactEcharts>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashChat;
