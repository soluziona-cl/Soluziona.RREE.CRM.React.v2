import React, { useEffect, useState, useRef } from 'react';
import Donut from './Componentes/Donut';
import Barras from './Componentes/Barras';
import Pie from './Componentes/Pie';
import DashReporteCargaTabla from './Componentes/DashReporteCargaTabla';
import ReporteIntervaloTablaDash2 from './Componentes/TablaChat';
// import ReporteIntervaloDetalleTablaDash from './Componentes/ReporteIntervaloDetalleTablaDash';
// import ReporteIntervaloTablaDash from './Componentes/ReporteIntervaloTablaDash';
import ReporteClaveUnicaDashboard from './Componentes/ReporteClaveUnicaDashboard';
import DashBarras from './Componentes/DashBarras';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DashBarrasTMO from './Componentes/DashBarrasTMO';
import { getToken, removeUserSession, setUserSession } from './Componentes/Common';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'animate.css';


const DashClaveUnica = () => {
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(true);
    const [key, setKey] = useState('trafico');


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
        const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM/"
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

        <ToastContainer autoClose={3000} /> 
        <div className="container-fluid">
            <div className="row flex-nowrap">
            </div>
            <div className="row flex-nowrap">
                <div className="col-auto px-0">
                    <div id="sidebar" className="collapse collapse-horizontal show border-end">

                    </div> 
                </div>
                <main className="col ps-md-2 pt-2">
                    <div className="row">
                        <div className="row animate__animated animate__slideInLeft">
                            <div className="col-12">
                                <div className="row mb-2 text-center">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="card mb-4 rounded-3 shadow-sm">
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal">Clave única  </h4>
                                            </div>
                                            {<ReporteClaveUnicaDashboard flujo={campana} > </ReporteClaveUnicaDashboard>}
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


export default DashClaveUnica;