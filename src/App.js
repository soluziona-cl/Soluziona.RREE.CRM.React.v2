import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import './App.css';
import Dashboard from "./html/Dashboard";
import Login from "./html/Login";
import 'bootstrap/dist/css/bootstrap.min.css';

import RepoAgentes from "./html/RepoAgentes.js";
import DashTrafico from "./html/DashTrafico";
import ResumenGeneral from "./html/ResumenGeneral";
import ResumenMensual from "./html/ResumenMensual";
import ResumenDiario from "./html/ResumenDiario";
import RepoResumenGestion from "./html/RepoResumenGestion";
import RepoDetalleFlujoLLamada from "./html/RepoDetalleFlujoLLamada";
import RepoEfectividadTransferencia from "./html/RepoEfectividadTransferencias";
import RepoExcel from "./html/RepoExcel";
import SubirArchivos from "./html/subirArchivos";
import RepoResultanteCampana from "./html/RepoResultanteCampana";
import RepoResultanteAcumuladoCampana from "./html/RepoResultanteAcumuladoCampana";
import RepoResumenHorario from "./html/RepoResumenHorario"
import DashChat from "./html/DashChat";
import Panel from "./html/Panel";
import DashClaveUnica from "./html/DashClaveUnica";
import RepoEpaInbound from "./html/RepoEpaInbound";
import RepoVideoLLamada from "./html/RepoVideoLLamada";
import RepoArchivoFuente from "./html/RepoArchivoFuente";
import RepoCarga from "./html/RepoCarga";
import ResumenGeneralDesarrollo from "./html/ResumenGeneralDesarrollo"
import ForzarCierre from "./html/ForzarCierre";
import Tipificaciones from "./html/Tipicaciones";
import BuscadorGrabacion from "./html/BuscadorGrabacion";


function App() {

  // const rutaservidor="/"; //Pruebas
  const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM"; //Produccion

  return (
    <Router>
      <Routes>
        <Route index path={rutaservidor} element={<Login />} />
        <Route path={rutaservidor + "/Panel"} element={<Panel />} />
        <Route path={rutaservidor + "/Dashboard"} element={<Dashboard />} />
        <Route path={rutaservidor + "/DashTrafico"} element={<DashTrafico />} />
        <Route path={rutaservidor + "/DashClaveUnica"} element={<DashClaveUnica/>} />
        <Route path={rutaservidor + "/DashChat"} element={<DashChat />} />
        <Route path={rutaservidor + "/RepoAgentes"} element={<RepoAgentes />} />
        <Route path={rutaservidor + "/ResumenGeneral"} element={<ResumenGeneral />} />
        <Route path={rutaservidor + "/ResumenMensual"} element={<ResumenMensual />} />
        <Route path={rutaservidor + "/ResumenDiario"} element={<ResumenDiario />} />
        <Route path={rutaservidor + "/RepoResumenGestion"} element={<RepoResumenGestion />} />
        <Route path={rutaservidor + "/RepoDetalleFlujoLLamada"} element={<RepoDetalleFlujoLLamada />} />
        <Route path={rutaservidor + "/RepoEfectividadTransferencia"} element={<RepoEfectividadTransferencia />} />
        <Route path={rutaservidor + "/RepoExcel"} element={<RepoExcel />} />
        <Route path={rutaservidor + "/SubirArchivos"} element={<SubirArchivos />} />
        <Route path={rutaservidor + "/RepoResultanteCampana"} element={<RepoResultanteCampana />} />
        <Route path={rutaservidor + "/RepoResultanteAcumuladoCampana"} element={<RepoResultanteAcumuladoCampana />} />
        <Route path={rutaservidor + "/RepoResumenHorario"} element={<RepoResumenHorario />} />
        <Route path={rutaservidor + "/RepoEpaInbound"} element={<RepoEpaInbound />} />
        <Route path={rutaservidor + "/RepoVideoLLamada"} element={<RepoVideoLLamada />} />
        <Route path={rutaservidor + "/RepoArchivoFuente"} element={<RepoArchivoFuente />} />
        <Route path={rutaservidor + "/RepoCarga"} element={<RepoCarga />} />
        <Route path={rutaservidor + "/ForzarCierre"} element={<ForzarCierre/>}/>
        <Route path={rutaservidor + "/RepoResumen"} element={<ResumenGeneralDesarrollo />} />
        <Route path={rutaservidor + "/Tipificaciones"} element={<Tipificaciones />} />
        <Route path={rutaservidor + "/BuscadorGrabacion"} element={<BuscadorGrabacion />} />


        

        
      </Routes>
    </Router>
  );
}

export default App;
