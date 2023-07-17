import "../css/styleRepoCarga.css";
import { useState, useEffect } from "react";
import "react-data-grid/lib/styles.css";

import { format } from "date-fns";
import Header from './Componentes/Header';
import SideBar from './Componentes/Sidebar';
import Footer from './Componentes/Footer';
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es'

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReporteResultanteCampanaTabla from './Componentes/ReporteResultanteCampanaTabla'

import Company_Campaing_Colas_Campana from './Componentes/Company_Campaing_Colas_Campana'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'animate.css';

registerLocale('es', es)

//con DataTable
const RepoResultanteCampana = () => {
  const [mostrarGrid, setMostrarGrid] = useState(false);
  const [mostrarGrid2, setMostrarGrid2] = useState(false);

  const [startdateini, setStartDateIni] = useState(new Date());
  const [startdatefin, setStartDateFin] = useState(new Date());
  const [company, setStartCompany] = useState('');
  const [campana, setStartCampana] = useState('');
  const [carga, setStartCampanaCarga] = useState('');

  const years = range(2022, getYear(new Date()) + 2, 1);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];



  //metodos para editar
  const filtrar = (event) => {

    setStartCompany(document.getElementById("ddl_company").value)
    setStartCampana(document.getElementById("ddl_campana").value)
    setStartCampanaCarga(document.getElementById("ddl_carga").value)
    setMostrarGrid(true);
    setMostrarGrid2(false);

    console.log(campana)
    console.log(company)
    console.log(carga)

  };

  const filtrar2 = (event) => {

    setStartCompany(document.getElementById("ddl_company").value)
    setStartCampana(document.getElementById("ddl_campana").value)
    setStartCampanaCarga(document.getElementById("ddl_carga").value)
    setMostrarGrid(false);
    setMostrarGrid2(true);
    console.log(campana)
    console.log(company)
    console.log(carga)
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


  // const onClick = useCallback(event => {
  //   console.log('Clicked Item : ', event.currentTarget);
  // }, [item]);


  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row flex-nowrap"><Header /></div>
        <div className="row flex-nowrap">
          <div className="col-auto px-0">
            <div id="sidebar" className="collapse collapse-horizontal show border-end">
              <SideBar />
            </div>
          </div>
          <main className="col ps-md-2 pt-2">
            <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" className="border rounded-3 p-1 text-decoration-none"><i className="fa-solid fa-bars py-2 p-1"></i> Menu</a>

            <div className="m-xs-0 m-lg-4"> <div className="page-header pt-3">
              <h2 className="page-header col-sm-12 col-lg-4 mt-lg-0 mt-sm-2 text-black">Reporte de Resultante Campaña</h2>
            </div>
              <hr />
              <div className="row ">
                <div className="col-12">
                  <Company_Campaing_Colas_Campana />
                </div>
              </div>
              <div className="row ">
                <div className="col-12">
                  <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
                    <div className="col-sm-12 col-md-12 col-lg-8">
                      <div className="card mb-4 rounded-3">
                        <div className="card-body">
                          <div className="row mt-2 align-items-center">
                            <div className="col-sm-12 col-md-3 col-lg-3 mt-lg-0 mt-sm-2">
                              {mostrarGrid === false && <button type="button" className="mb-0 btn btn-success" onClick={() => filtrar(1)}>Buscar</button>}
                              {mostrarGrid === true && <button type="button" className="mb-0 btn btn-success" onClick={() => filtrar2(2)}>Buscar</button>}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <section className="col-lg-12 col-md-12 col-sm-12 mt-2 ">
                {/* <TablaFull /> */}
                <div className="mt-2">
                  {mostrarGrid !== false && <ReporteResultanteCampanaTabla campanas={campana} cargas={carga} />}
                  {mostrarGrid2 !== false && <ReporteResultanteCampanaTabla campanas={campana} cargas={carga} />}

                </div>

              </section>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RepoResultanteCampana;
