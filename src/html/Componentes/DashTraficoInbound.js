import React, { useEffect, useState, useRef } from 'react';
import ReporteIntervaloTablaDash from './ReporteIntervaloTablaDash';
import ReporteIntervaloDetalleTablaDash from './ReporteIntervaloDetalleTablaDash';
import DashBarras from './DashBarras';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DashBarrasTMO from './DashBarrasTMO';
import DashBarrasTipificacion from './DashBarrasTipificacion';
import PanelInboundEstatico from './PanelInboundEstatico';
import PieAcumulado from './PieAcumulado';
import Company_Campaing_Colas_Dash from './Company_Campaing_Colas_Dash';
import Company_Campaing_Colas from './Company_Campaing_Colas';
import { getToken, removeUserSession, setUserSession } from './Common';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'animate.css';


const DashTraficoInbound = () => {
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(true);
    const [key, setKey] = useState('trafico');
    const [key2, setKey2] = useState('trafico2');


    const [mostrarGrid, setMostrarGrid] = useState(true);
    const [mostrarGrid2, setMostrarGrid2] = useState(false);
    const [mostrarGrid3, setMostrarGrid3] = useState(false);

    const [company, setStartCompany] = useState('0');
    const [campana, setStartCampana] = useState('0');


    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };
    useEffect(() => {

        const token = getToken();
        const rutaservidor = "/Orkesta/Soluziona/CRM_RREE/"
        if (!token) {

            // console.log('Vacio')
            navigate(rutaservidor);
            return;

        }
        setAuthLoading(false);
        // Datos()

    }, []);



    const HideLogo = () => {
        // setshowlogo(!showlogo);
        setStartCompany(document.getElementById("ddl_company").value)
        setStartCampana(document.getElementById("ddl_campana").value)

        // Filtrar(!filtrar)
    }

    const filtrar = (event) => {

        // setCompany(document.getElementById("ddl_company").value)
        setStartCampana(document.getElementById("ddl_campana").value)
        setMostrarGrid(true);
        setMostrarGrid2(false);
        setMostrarGrid3(true);
        console.log("se trigeo el filtrar")
        // setFlujo(document.getElementById("ddl_campana").options[document.getElementById("ddl_campana").selectedIndex].text)

    };

    const filtrar2 = (event) => {

        // setStartCompany(document.getElementById("ddl_company").value)
        setStartCampana(document.getElementById("ddl_campana").value)
        setMostrarGrid(false);
        setMostrarGrid2(true);
        setMostrarGrid3(true);
        console.log("se trigeo el filtrar 2")
        // setFlujo(document.getElementById("ddl_campana").options[document.getElementById("ddl_campana").selectedIndex].text)

    };

    const filtrar3 = (event) => {

        setStartCampana(document.getElementById("ddl_campana").value)

        if (document.getElementById("ddl_campana").value == '0') {
            toast.error("Por favor seleccionar Campaña");
            // console.log(campana)
        } else {
            (event === '1') ? filtrar() : filtrar2()
        }
    };

    return (<>

        <ToastContainer autoClose={3000} /> <div className="container-fluid">
            <div className="row flex-nowrap">
            </div>
            <div className="row flex-nowrap">
                <div className="col-auto px-0">
                    <div id="sidebar" className="collapse collapse-horizontal show border-end">

                    </div> </div> <main className="col ps-md-2 pt-2">
                
                        <div className="row animate__animated animate__slideInRight">
                            <div className="col-12">
                                <div className="row mb-2 text-center">
                                    <div className="col-sm-12 col-lg-12 ms-0">
                                        <div className="col-sm-12 col-lg-12 card mb-4 rounded-3 shadow-sm">
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal"> Acumulado</h4> 
                                            </div> 
                                                <div className="card-body">
                                                <Tabs
                                                    id="controlled-tab-example"
                                                    activeKey={key}
                                                    onSelect={
                                                        (k) => setKey(k)}
                                                    className="mb-3">
                                                    <Tab eventKey="trafico"
                                                        title="Acumulado Día">  
                                                        <PanelInboundEstatico flujo={campana} > </PanelInboundEstatico>
                                                    </Tab>
                                                    <Tab eventKey="graficoAcumulado"
                                                        title="Opciones IVR"> 
                                                           <PieAcumulado flujo={campana} > </PieAcumulado>
                                                    </Tab>
                                                </Tabs>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    <div className="page-header pt-3">
                        <div className="row mt-2 align-items-center mb-3">
                           {/* <Company_Campaing_Colas_Dash /> */}
                           <Company_Campaing_Colas />
                            <div className="col-sm-12 col-lg-3 mt-lg-0 mt-sm-2 ">
                                {mostrarGrid === false && <button type="button" className="mb-0 btn btn-success" onClick={() => filtrar3("1")} > Buscar </button>}
                                {mostrarGrid === true && <button type="button" className="mb-0 btn btn-success" onClick={() => filtrar3("2")} > Buscar </button>}
                            </div>
                        </div>
                    </div>
                 
                    <div className="row mt-2">

                        <div className="row animate__animated animate__slideInLeft">
                            <div className="col-12">
                                <div className="row mb-2 text-center">
                                    <div className="col-sm-12 col-lg-12 ms-2">
                                        <div className="card mb-4 rounded-3 shadow-sm">
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal">Tráfico</h4> </div> <div className="card-body">

                                                {mostrarGrid !== false && mostrarGrid3 !== false && <ReporteIntervaloTablaDash flujo={campana} > </ReporteIntervaloTablaDash>} {
                                                    mostrarGrid2 !== false && mostrarGrid3 !== false && <ReporteIntervaloTablaDash flujo={campana} > </ReporteIntervaloTablaDash>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row animate__animated animate__slideInRight">
                            <div className="col-12">
                                <div className="row mb-2 text-center">
                                    <div className="col-sm-12 col-lg-12 ms-2">
                                        <div className="col-sm-12 col-lg-12 card mb-4 rounded-3 shadow-sm">
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal">Evolución</h4> </div> 
                                                <div className="card-body">
                                                <Tabs
                                                    id="controlled-tab-example"
                                                    activeKey={key2}
                                                    onSelect={
                                                        (k) => setKey2(k)}
                                                    className="mb-3 ms-2">
                                                    <Tab eventKey="trafico2"
                                                        title="Trafico"> {
                                                            mostrarGrid !== false && mostrarGrid3 !== false && <DashBarras flujo={campana} > </DashBarras>} {
                                                            mostrarGrid2 !== false && mostrarGrid3 !== false && <DashBarras flujo={campana} > </DashBarras>}

                                                    </Tab>
                                                     <Tab eventKey="tmo"
                                                        title="TMO"> {
                                                            mostrarGrid !== false && mostrarGrid3 !== false && <DashBarrasTMO flujo={campana} > </DashBarrasTMO>} {
                                                            mostrarGrid2 !== false && mostrarGrid3 !== false && <DashBarrasTMO flujo={campana} > </DashBarrasTMO>}

                                                    </Tab>
                                                    <Tab eventKey="tipificacion"
                                                        title="Tipificacion"> {
                                                            mostrarGrid !== false && mostrarGrid3 !== false && <DashBarrasTipificacion flujo={campana} > </DashBarrasTipificacion>} {
                                                            mostrarGrid2 !== false && mostrarGrid3 !== false && <DashBarrasTipificacion flujo={campana} > </DashBarrasTipificacion>}

                                                    </Tab>
                                                </Tabs>


                                                {
                                                    /* {filtrar !== false &&
                                                                                <DashReporteCargaTablaFilter company={company} carga={carga}></DashReporteCargaTablaFilter>} */
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row animate__animated animate__slideInLeft">
                            <div className="col-12">
                                <div className="row mb-2 text-center" >
                                    <div className="col-sm-12 col-lg-12 ms-2">
                                        <div className="card mb-4 rounded-3 shadow-sm">
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal">Intervalo</h4>
                                            </div>
                                            <div className="card-body"> {
                                                mostrarGrid !== false && mostrarGrid3 !== false && < ReporteIntervaloDetalleTablaDash flujo={campana} > </ReporteIntervaloDetalleTablaDash>} {
                                                mostrarGrid2 !== false && mostrarGrid3 !== false && < ReporteIntervaloDetalleTablaDash flujo={campana} > </ReporteIntervaloDetalleTablaDash>}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>


    </>
    )
};


export default DashTraficoInbound;