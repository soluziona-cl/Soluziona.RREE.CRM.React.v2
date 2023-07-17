import React from "react"
import { useNavigate } from "react-router-dom";
import "../../css/general.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken, removeUserSession, setUserSession } from './Common';

function Header() {

    const navigate = useNavigate();
    const handleLogout = () => {

        removeUserSession();
        navigate(rutaservidor);
    };

   // const rutaservidor="/"; //Pruebas
   const rutaservidor = "/Orkesta/Aporta/RegistroCivil/CRM"; //Produccion
   
    return (
        <>  
            
            <div className=" top-0 " id="header">
                <div className=" justify-content-around align-content-around  py-0 my-3 m-3">
                    <div className="align-content-around justify-content-around" id="mobile-menu-2">
                   
                    <img src="./logo.png" id="logo" className="ms-2" alt="logo" width={50} />  <span className=" ms-2" style={{ color: 'white' }}>Control CRM Orkesta Registro Civil</span>
                    </div>
                    
                    <div className=" my-2 mt-0 position-absolute end-0 translate-middle">
                        <button 
                            onClick={handleLogout}
                            className="btn btn-danger mb-5 sm" 
                        ><i className="fa-solid fa-right-from-bracket m-2"></i>
                             Salir
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Header;
