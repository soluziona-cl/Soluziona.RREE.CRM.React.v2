import React from "react";
// import { Link } from 'react-router-dom';
import { useState, FC, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import icon from "../../assets/iconOrkesta.png";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { getToken, removeUserSession, setUserSession } from "./Common";

const SideBar = () => {
  const [open, setOpen] = useState(true);

  const [mostrar, setMostrar] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const sesiones = {
    sgui: localStorage.getItem("localgui"),
    scliente: localStorage.getItem("localcliente"),
    sid: localStorage.getItem("localid"),
    sid_usuario: localStorage.getItem("localid_usuario"),
    stoken: localStorage.getItem("token"),
  };
  const mostrarClick = (event) => {
    setMostrar((current) => !current);
  };

  function CheckUser() {
    axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_Check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
      .then(response => {

        setUserSession(sesiones.sgui, sesiones.sid_usuario);
        setAuthLoading(true);
        console.log(sesiones.sid_usuario);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(true);
      });
  }

  const navigate = useNavigate();
  // const rutaservidor="/"; //Pruebas
  const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM"; //Produccion
  return (
    <>
      {sesiones.sid_usuario === "1" ? (
        <div id="sidebar-nav" className="list-group border-0 rounded-0 text-sm-start min-vh-100">
          {/* <Link  to={rutaservidor + '/Dashboard'} className='list-group-item    d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><i className="fa-solid fa-chart-line"></i><span className="ms-1  d-none d-sm-inline">Dashboard</span></div></Link> */}
          <Link to={rutaservidor + "/Panel"} className="list-group-item    d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><i className="fa-solid fa-chart-line"></i><span className="ms-1  d-none d-sm-inline">Panel Tráfico Día</span></div></Link>

          {/* <a href={rutaservidor + "/Dashboard"} className="list-group-item    d-inline-block text-truncate" data-bs-parent="#sidebar"><i className="fa-solid fa-chart-line"></i><span className="ms-1  d-none d-sm-inline">Dashboard</span></a> */}
          {/* <a href={rutaservidor + "/SubirArchivos"} className="list-group-item   d-inline-block text-truncate" data-bs-parent="#sidebar"><i className="fa-solid fa-upload"></i><span className="ms-1 d-none d-sm-inline">Subir Archivos</span></a>
          <a href={rutaservidor + "/AdminCargas"} className="list-group-item  d-inline-block text-truncate" data-bs-parent="#sidebar"><i className="fa-solid fa-user"></i><span className="ms-1 d-none d-sm-inline">Administrador de Cargas</span></a> */}
          <div className="dropdown ">
            <a className="d-flex align-items-center  list-group-item border-end-0   d-inline-block text-truncate link-dark text-decoration-none dropdown-toggle" href="#" data-bs-toggle="dropdown" id="navbarDropdownReportes" aria-expanded="false">
              <i class="fa-solid fa-file"></i><span className="ms-1 d-none d-sm-inline">Gestion</span>
            </a>
            <ul className="dropdown-menu   text-small shadow" aria-labelledby="navbarDropdownReportes">
              <Link to={rutaservidor + '/RepoAgentes'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Agentes</span></div></Link>
              <Link to={rutaservidor + "/ResumenGeneral"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Tramo Horario</span></div></Link>
              <Link to={rutaservidor + "/ForzarCierre"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Forzar Cierre</span></div></Link>
              <Link to={rutaservidor + "/Tipificaciones"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Tipificaciones</span></div></Link>


              {/* <Link to={rutaservidor + "/ResumenMensual"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Mensual</span></div></Link>
              <Link to={rutaservidor + "/ResumenDiario"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Diario{" "}</span></div></Link>
              <Link to={rutaservidor + '/RepoResumenHorario'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Resumen Horario</span></div></Link>
              <Link to={rutaservidor + '/RepoResumenGestion'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Resumen Gestion</span></div></Link>
              <Link to={rutaservidor + '/RepoEfectividadTransferencia'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Efectividad Transferencias</span></div></Link>
              <Link to={rutaservidor + "/RepoEpaInbound"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Epa Inbound</span></div></Link>
              <Link to={rutaservidor + "/RepoVideoLLamada"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Clave Única</span></div></Link>
              <Link to={rutaservidor + "/RepoArchivoFuente"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Archivo Fuente</span></div></Link>
              <Link to={rutaservidor + "/RepoCarga"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Consolidado Mes</span></div></Link>
              <Link to={rutaservidor + "/RepoResumen"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Desarrollo</span></div></Link> */}
           
            </ul>

          </div>
          {/* <div className="dropdown ">
            <a className="d-flex align-items-center  list-group-item border-end-0   d-inline-block text-truncate link-dark text-decoration-none dropdown-toggle" href="#" data-bs-toggle="dropdown" id="navbarDropdownReportes" aria-expanded="false">
              <i class="fa-solid fa-file"></i><span className="ms-1 d-none d-sm-inline">Grabacion </span>
            </a>
            <ul className="dropdown-menu   text-small shadow" aria-labelledby="navbarDropdownReportes">
              <Link to={rutaservidor + '/RepoResumenGestion'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Buscador</span></div></Link>
              
              <Link to={rutaservidor + "/ResumenGeneral"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Tramo Horario</span></div></Link>
              <Link to={rutaservidor + "/ForzarCierre"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Forzar Cierre</span></div></Link>
              <Link to={rutaservidor + "/Tipidicaciones"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Tipificaciones</span></div></Link>
              <Link to={rutaservidor + "/ResumenMensual"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Mensual</span></div></Link>
              <Link to={rutaservidor + "/ResumenDiario"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Diario{" "}</span></div></Link>
              <Link to={rutaservidor + '/RepoResumenHorario'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Resumen Horario</span></div></Link>
              <Link to={rutaservidor + '/RepoResumenGestion'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Resumen Gestion</span></div></Link>
              <Link to={rutaservidor + '/RepoEfectividadTransferencia'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Efectividad Transferencias</span></div></Link>
              <Link to={rutaservidor + "/RepoEpaInbound"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Epa Inbound</span></div></Link>
              <Link to={rutaservidor + "/RepoVideoLLamada"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Clave Única</span></div></Link>
              <Link to={rutaservidor + "/RepoArchivoFuente"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Archivo Fuente</span></div></Link>
              <Link to={rutaservidor + "/RepoCarga"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Reporte Consolidado Mes</span></div></Link>
              <Link to={rutaservidor + "/RepoResumen"} className="dropdown-item border-end-0 d-inline-block text-truncate"><div className="ml-2  text-slate-200 text-sm font-medium"><span className="ms-1  d-none d-sm-inline">Resumen Desarrollo</span></div></Link> 
           
            </ul>

          </div> */}
        </div>
      ) : (
        ""
      )}
      {sesiones.sid_usuario === "2" ? (
        <div
          id="sidebar-nav"
          className="list-group border-0 rounded-0 text-sm-start min-vh-100"
        >
          {/* <Link to={rutaservidor + '/DashboardAgente'} className='dropdown-item border-end-0 d-inline-block text-truncate'><div className='ml-2  text-slate-200 text-sm font-medium'><span className="ms-1  d-none d-sm-inline">Agente</span></div></Link> */}
          <Link to={rutaservidor + "/DashboardAgente"} className="list-group-item    d-inline-block text-truncate">
            <div className="ml-2  text-slate-200 text-sm font-medium">
              <i className="fa-solid fa-user"></i>
              <span className="ms-1  d-none d-sm-inline">Agente</span>
            </div>
          </Link>
        </div>
      ) : (
        ""
      )}

      {sesiones.sid_usuario === "10" ? (
        <div id="sidebar-nav" className="list-group border-0 rounded-0 text-sm-start min-vh-100">
          <Link to={rutaservidor + "/DashTrafico"} className="list-group-item    d-inline-block text-truncate">
            <div className="ml-2  text-slate-200 text-sm font-medium">
              <i className="fa-solid fa-chart-line"></i>
              <span className="ms-1  d-none d-sm-inline">
                Panel Trafico Dia
              </span>
            </div>
          </Link>
          <Link to={rutaservidor + "/SubirArchivos"} className="list-group-item    d-inline-block text-truncate">
            <div className="ml-2  text-slate-200 text-sm font-medium">
              <i className="fa-solid fa-upload"></i>
              <span className="ms-1  d-none d-sm-inline">Subir Archivos</span>
            </div>
          </Link>
          <div className="dropdown ">
            <a className="d-flex align-items-center  list-group-item border-end-0   d-inline-block text-truncate link-dark text-decoration-none dropdown-toggle" href="#" data-bs-toggle="dropdown" id="navbarDropdownReportes" aria-expanded="false">
              <i className="fa-solid fa-bars"></i>
              <span className="ms-1 d-none d-sm-inline">Reportes</span>
            </a>
            <ul className="dropdown-menu text-small shadow" aria-labelledby="navbarDropdownReportes">
              <Link to={rutaservidor + "/RepoIntervalo"} className="dropdown-item border-end-0 d-inline-block text-truncate" >
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Telefonico Intervalo
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoTelefonicoAcumulado"} className="dropdown-item border-end-0 d-inline-block text-truncate" >
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Telefonico Acumulado
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoAutoAtenciones"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    AutoAtenciones
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoResumenFlujoLLamada"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Flujo Llamadas
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoDetalleFlujoLLamada"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Detalle Flujo Llamadas
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoTipificadasAgente"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Tipificadas Ejecutivo
                  </span>
                </div>
              </Link>
            </ul>
          </div>
          <div className="dropdown ">
            <a className="d-flex align-items-center  list-group-item border-end-0   d-inline-block text-truncate link-dark text-decoration-none dropdown-toggle" href="#" data-bs-toggle="dropdown" id="navbarDropdownReportes" aria-expanded="false">
              <i className="fa-solid fa-bars"></i>
              <span className="ms-1 d-none d-sm-inline  ">
                Reportes Outbound
              </span>
            </a>
            <ul className="dropdown-menu   text-small shadow" aria-labelledby="navbarDropdownReportes">
              <Link to={rutaservidor + "/RepoResultanteCampana"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Resultante Campaña
                  </span>
                </div>
              </Link>
              <Link to={rutaservidor + "/RepoResultanteAcumuladoCampana"} className="dropdown-item border-end-0 d-inline-block text-truncate">
                <div className="ml-2  text-slate-200 text-sm font-medium">
                  <span className="ms-1  d-none d-sm-inline">
                    Resultante Acumulado Campaña
                  </span>
                </div>
              </Link>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SideBar;
