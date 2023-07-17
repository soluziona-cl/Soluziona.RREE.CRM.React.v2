import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import ClockLoader from "react-spinners/ClockLoader";

//TODO variable global para pasar por Json el rol del usuario en el metodo guardar nuevo

function DashBarrasTipificacion({ flujo }) {

  const [data, setData] = useState([]);
  const [datafull, setDataFull] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [tabla, setTable] = useState(false);
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
    }, 2000)
  }, [])


  useEffect(() => {
    const token = getToken();

    const rutaservidor = "/Orkesta/Procollect/CRM"   // revisar endpoint
    if (!token) {
      // console.log('Vacio')
      navigate(rutaservidor);
      return;
    }


    axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
      .then(response => {

        setUserSession(sesiones.sgui, sesiones.sid_usuario);
        setAuthLoading(false);


      }).catch(error => {
        removeUserSession();
        setAuthLoading(false);
      });

    Datos()
    DatosFull()

  }, []);

  const Datos = (async () => {

    const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Tipificaciones',
      { dato: flujo },
      { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

    if (result.status === 200) {


      setData(result.data);

    }

  })

  const DatosFull = (async () => {

    const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Tipificaciones/Full',
      { dato: flujo },
      { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

    if (result.status === 200) {

      setDataFull(result.data);
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

  })

  let columns = []
  let cantidad = []

  data.forEach((element) => {

    cantidad.push(parseInt(element.cantidad))
    columns.push(element.operacion.replace(" ","\n").replace(" ","\n").replace(" ","\n"))
  });

  const opction_multibar = {

    grid: {
      x: 40,
      x2: 40,
      y: 35,
      y2: 65
  },

    // Add tooltip
    tooltip: {
      trigger: 'axis'
    },

    // Add legend
    legend: {
      data: ['Operacion']
    },

    toolbox: {
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },

      }
    },

    color: ['#666EE8'],
    // Enable drag recalculate
    calculable: true,

    // Horizontal axis
    xAxis: [{
      type: 'category',
      axisLabel: { interval: 0 },
      data: columns,
    }],

    // Vertical axis
    yAxis: [{
      type: 'value',
      min: 0,
      max: function (value) {
        return value.max + 10;
      },
      name: 'Cantidad'
    }],

    // Add series
    series: [{
      name: 'Operacion',
      type: 'bar',
      data: cantidad,
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
      // ,
      // markPoint: {
      //   data: [
      //     { type: 'max', name: 'Max' },
      //     { type: 'min', name: 'Min' }
      //   ]
      // },
      // markLine: {
      //   data: [{ type: 'average', name: 'Promedio' }]
      // }
    }
    ]


  }

  const onChartClick = (params) => {
    // console.log('Chart clicked', params.name);
    // console.log('Chart clicked', params.data);

    if (params.name === 'Otros') {

      // alert('Mostrar')
      setTable(true)
    }

  };

  const onEvents = {
    click: onChartClick,
  };

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
        fontSize: '14px',

      },

    },

  };


  const columnas = [
    {
      name: 'Ranking',
      selector: row => row.posicion,
      center: true
    },
    {
      name: <div className="text-wrap">Operacion</div>,
      selector: row => row.operacion,
      center: true
    },
    {
      name: <div className="text-wrap">Cantidad</div>,
      selector: row => row.cantidad,
      center: true
    }
  ];

  const handleOcultar = () => {

    setTable(false)
    //creates a new workbook
    // alert('ocultar')
  };


  return (<>
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

    ) : (<div className="row">
      <div className={tabla ? "d-none" : "visible col-12"} >
      <ReactEcharts option={opction_multibar} onEvents={onEvents} ></ReactEcharts>
      </div>
      <div className={tabla ? "visible col-12" : "d-none"}>
        <section className="float-end">
          <button onClick={(e) => handleOcultar()} className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary text-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" >
            Volver
          </button>
        </section>
        <div className="mt-5" >
          <DataTable
            columns={columnas}
            data={datafull}
            highlightOnHover
            striped
            pagination
            customStyles={customStyles} />

        </div>


      </div>
    </div>)}

  </>
  );
}

export default DashBarrasTipificacion