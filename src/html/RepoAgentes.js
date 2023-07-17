import "../css/styleRepoCarga.css";
import { useState, useEffect } from "react";
import "react-data-grid/lib/styles.css";

import { format } from "date-fns";
import Header from './Componentes/Header';
import Sidebar from './Componentes/Sidebar';
import Footer from './Componentes/Footer';
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es'

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import 'bootstrap/dist/css/bootstrap.min.css';
import Company_Campaing from './Componentes/Company_Campaing';
import ReporteAgentesTabla from './Componentes/ReporteAgentesTabla'


registerLocale('es', es)

//con DataTable
const RepoAgentes = () => {
  const [mostrarGrid, setMostrarGrid] = useState(false);

  const [startdateini, setStartDateIni] = useState(new Date());
  const [startdatefin, setStartDateFin] = useState(new Date());
  const [company, setStartCompany] = useState('');
  const [campana, setStartCampana] = useState('');

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

  // useEffect(() => {
  //   FullTable()
  //   // IntervaleFullTable()

  // }, []);

  //metodos para editar
  const filtrar = (event) => {

    setStartCompany(document.getElementById("ddl_company").value)
    setStartCampana(document.getElementById("ddl_campana").value)
    setMostrarGrid(true);
  
  };

  // const FullTable = async (startdateini, startdatefin) => {
  //   const result = await axios.post(
  //     "https://app.soluziona.cl/API_desa/Soluziona.Dashboard.Salcobrand/api/Contact_CRM/CRM/Trafico/Inbound/Full/Fechas",
  //     {
  //       dato: format(startdateini, "yyyyMMdd"),
  //       dato_1: format(startdatefin, "yyyyMMdd"),
  //     }
  //   );
  //   setDataFull(result.data);
  // };

  // const FullTableIntervalo = (async (startdateini, startdatefin) => {
  //   const result = await axios.post("https://app.soluziona.cl/API_desa/Soluziona.Dashboard.Salcobrand/api/Contact_CRM/CRM/Trafico/Inbound/Intervalo/Fechas", { dato: format(startdateini, "yyyyMMdd"), dato_1: format(startdatefin, "yyyyMMdd") })
  //   setDataFullIntervalo(result.data);

  // })

  
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

            <div className="m-xs-0 m-lg-4"> <div className="page-header pt-3">
              <h2 className="page-header col-sm-12 col-lg-3 mt-lg-0 mt-sm-2 text-black">Reporte de Agentes</h2>
            </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <Company_Campaing />
                  <div className="page-header col-sm-12 col-lg-3 mt-lg-0 mt-sm-2">
                    <h3>Rango de Fechas (Desde - Hasta)</h3>
                  </div>
                  <div className="row mt-2 bg-light align-items-center">

                    <div className="col-sm-12 col-lg-3 mt-lg-0 mt-sm-2">
                      <DatePicker
                        id="ini"
                        locale='es'
                        className="form-control rounded-md text-center h-10 hover:bg-gray-200 hover:border-blue-700 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                        //  customInput={<ExampleCustomInput />}
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div
                            style={{
                              margin: 10,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                            >
                              {"<"}
                            </button>
                            <select
                              value={getYear(date)}
                              onChange={({ target: { value } }) => changeYear(value)}
                            >
                              {years.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <select
                              value={months[getMonth(date)]}
                              onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              }
                            >
                              {months.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                            >
                              {">"}
                            </button>
                          </div>
                        )}
                        selected={startdateini}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        onChange={(date) => {
                          setStartDateIni(date);

                        }}
                      /></div>
                    <div className="col-sm-12 col-lg-3 mt-lg-0 mt-sm-2">
                      <DatePicker
                        id="fin"
                        locale='es'
                        className="form-control rounded-md text-center h-10 hover:bg-gray-200 hover:border-blue-700 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                        //  customInput={<ExampleCustomInput />}
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div
                            style={{
                              margin: 10,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                            >
                              {"<"}
                            </button>
                            <select
                              value={getYear(date)}
                              onChange={({ target: { value } }) => changeYear(value)}
                            >
                              {years.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <select
                              value={months[getMonth(date)]}
                              onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              }
                            >
                              {months.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                            >
                              {">"}
                            </button>
                          </div>
                        )}
                        selected={startdatefin}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        onChange={(date) => {
                          setStartDateFin(date);

                        }}
                      /></div>
                    <div className="col-sm-12 col-lg-3 mt-lg-0 mt-sm-2">  
                    <button
                      className="mb-0 btn btn-success"   
                      onClick={filtrar}
                    >Buscar
                    </button>

                    </div>

                  </div>
                  <section className="w-fit flex flex-col justify-center items-end mt-2">
                    {/* <TablaFull /> */}
                    {mostrarGrid !== false && <ReporteAgentesTabla flujo={company} campana={campana} ini={format(startdateini, "yyyyMMdd")} fin={format(startdatefin, "yyyyMMdd")} />}
                  </section>

                </div>
              </div>
            </div>


          </main>

        </div>
        <Footer />
      </div>



    </>
  );
};

export default RepoAgentes;
