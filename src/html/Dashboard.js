import React, { useEffect, useState, useRef } from 'react';
import Donut from './Componentes/Donut';
import Barras from './Componentes/Barras';
import Pie from './Componentes/Pie';
import Header from './Componentes/Header';
import Sidebar from './Componentes/Sidebar';
import Footer from './Componentes/Footer';
import Company_Campaing_Dash from './Componentes/Company_Campaing_Dash';

import DashReporteCargaTabla from './Componentes/DashReporteCargaTabla';
import DashReporteCargaTablaFilter from './Componentes/DashReporteCargaTablaFilter';
import PieGestion from './Componentes/PieGestion';
import DashReporteFechaPago from './Componentes/DashReporteFechaPago';

import { getToken, removeUserSession, setUserSession } from '../html/Componentes/Common';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {


  const [filtrar, Filtrar] = useState(false);
  const [company, setCompany] = useState('');
  const [carga, setCarga] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  

  const HideLogo = () => {
    // setshowlogo(!showlogo);
    setCompany(document.getElementById("ddl_company").value)
    setCarga(document.getElementById("ddl_campana").value)

    Filtrar(!filtrar)
  }

  const sesiones = {
    sgui: localStorage.getItem("localgui"),
    scliente: localStorage.getItem("localcliente"),
    sid: localStorage.getItem("localid"),
    sid_usuario: localStorage.getItem("localid_usuario"),
    stoken: localStorage.getItem("token")
};

useEffect(() => {
  const token = getToken();
      const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM/"
      if (!token) {

          // console.log('Vacio')
          navigate(rutaservidor);
          return;

      }
      setAuthLoading(false);


}, []);


  return (
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap"><Header /></div>
        <div className="row flex-nowrap">
          <div className="col-auto px-0">
            <div id="sidebar" className="collapse collapse-horizontal show border-end">
              <Sidebar />
            </div>
          </div>
          <main className="col ps-md-2 pt-2">
            <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="border rounded-3 p-1 text-decoration-none"><i className="fa-solid fa-bars py-2 p-1"></i> Menu</a>
            <div className="page-header pt-3">
              <h2>Dashboard</h2>
            </div>
            <hr />
            <div className="row">

              <div className="row">
                <div className="col-12">
                  <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div className="col-sm-12 col-lg-4">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Agentes Conectados</h4>
                        </div>
                        <div className="card-body">
                          <Pie></Pie>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-lg-8">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Trafico Intervalo</h4>
                        </div>
                        <div className="card-body">
                          <Barras></Barras>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
                    <div className="col-sm-12 col-lg-4">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Gestion de Cargas</h4>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive overflow-x: hidden;">
                            <DashReporteCargaTabla></DashReporteCargaTabla>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-lg-4">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Compromiso de Pagos</h4>
                        </div>
                        <div className="card-body">                        
                            <PieGestion></PieGestion>                        
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-lg-4">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Fechas Compromiso</h4>
                        </div>
                        <div className="card-body">                        
                            <DashReporteFechaPago></DashReporteFechaPago>                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">

                <div className="col-12">
                  <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
                    <div className="col-sm-12 col-lg-12">
                      <div className="card mb-4 rounded-3 shadow-sm">
                        <div className="card-header">
                          <h4 className="my-0 font-weight-normal">Gestion Ultimos 10 Dias</h4>
                          <hr />
                          <div className="row mt-2 bg-light align-items-center">
                            <Company_Campaing_Dash></Company_Campaing_Dash>
                            <div className="col-sm-12 col-lg-3 mt-lg-0 mt-sm-2">
                              <button
                                className="mb-0 btn btn-success"
                                onClick={HideLogo}
                              >Buscar
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          {filtrar !== false &&
                            <DashReporteCargaTablaFilter company={company} carga={carga}></DashReporteCargaTablaFilter>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>


            </div>
          </main>

        </div>
        <Footer />
      </div>


    </>
  )
};


export default Dashboard;