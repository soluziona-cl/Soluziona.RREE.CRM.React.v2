import React, { useEffect, useState, useRef } from 'react';
import Header from './Componentes/Header';
import Sidebar from './Componentes/Sidebar';
import Footer from './Componentes/Footer';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { getToken, removeUserSession, setUserSession } from './Componentes/Common';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import AcumuladoDiaPanel from './Componentes/AcumuladoDiaPanel';
import Intervalo_Gestion_Hoy from './Componentes/Intervalo_Gestion_Hoy';
import IntervaloDiaPanel from './Componentes/Intervalo_Dia';

import 'react-toastify/dist/ReactToastify.css';

import 'animate.css';


const Panel = () => {
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(true);
    const [key, setKey] = useState('trafico');


    const [mostrarGrid, setMostrarGrid] = useState(true);
    const [mostrarGrid2, setMostrarGrid2] = useState(false);
    const [mostrarGrid3, setMostrarGrid3] = useState(false);

    const [company, setStartCompany] = useState('0');
    const [campana, setStartCampana] = useState('0');

    //get a reference to the element
    //const refresh = document.getElementById('refresh');

    //add event listener
    //    refresh.addEventListener('click', function(event) {
    //      window.location.href='/Orkesta/Soluziona/CRM_RREE/Panel';
    //    });

    //    onclick="location.href='/Orkesta/Soluziona/CRM_RREE/Panel';"
    //    const [refresh, setRefresh] = useState(false);

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

    const refresh = () => {
        window.location.href = '/Orkesta/Soluziona/CRM_RREE/Panel';
    }

    return (<>

        <ToastContainer autoClose={3000} /> <div className="container-fluid">
            <div className="row flex-nowrap">
                < Header /> 
            </div> 
            <div className="row flex-nowrap">
                <div className="col-auto px-0">
                    <div id="sidebar" className="collapse collapse-horizontal show border-end">
                        <Sidebar />
                    </div> 
                    </div>
                <main className="col ps-md-2 pt-2">
                    <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="border rounded-3 p-1 text-decoration-none"> <i className="fa-solid fa-bars py-2 p-1"> </i> Menu</a >
                    <hr />


                    <button className='btn btn-info' onClick={refresh}><i class="fa-solid fa-arrows-rotate me-2"></i>Refrescar</button>


                    <div className="row">
                        <div className="row animate__animated animate__slideInRight">
                            <div className="col-12" >
                                <div className="row mb-2 text-center" >
                                    <div className="col-sm-12 col-lg-12 ms-2" >
                                        <div className="col-sm-12 col-lg-12 card mb-4 rounded-3 shadow-sm"  >
                                            <div className="card-header">
                                                <h4 className="my-0 font-weight-normal"> RREE </h4>
                                            </div>
                                            <div className='card-body'>
                                            
                                                <AcumuladoDiaPanel></AcumuladoDiaPanel>
                                                <Intervalo_Gestion_Hoy></Intervalo_Gestion_Hoy>
                                                <IntervaloDiaPanel></IntervaloDiaPanel>
                                                

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


export default Panel;