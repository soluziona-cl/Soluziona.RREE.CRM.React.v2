import React, { useEffect, useState, useRef } from 'react';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { getToken, removeUserSession, setUserSession } from './Common';
import { useNavigate } from 'react-router-dom';

function Company_Campaing_Colas_Campana() {
    const [selectLlamada, setSelectedLlamada] = useState('');
    const [selectLlamadaDetalle, setSelectedLlamadaDetalle] = useState('');
    const [selectLlamadaDetalleCarga, setSelectedLlamadaDetalleCarga] = useState('');

    const [optionList, setOptionList] = useState([]);
    const [optionListDetalle, setOptionListDetalle] = useState([]);


    const [optionListDetalleCarga, setOptionListDetalleCarga] = useState([]);

    const [optionListDetalleEstado, setOptionListDetalleEstado] = useState(true);
    const [optionListDetalleEstadoSelect, setOptionListDetalleEstadoSelect] = useState('0');

    const [optionListDetalleEstadoCargas, setOptionListDetalleEstadoCargas] = useState(true);
    const [optionListDetalleEstadoSelectCargas, setOptionListDetalleEstadoSelectCargas] = useState('0');



    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };

    useEffect(() => {
        Company(sesiones.sid_usuario)
    }, []);



    const Company = (async (company) => {

        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Flujo_Company', { dato: company }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {
            setOptionList(result.data)

            // console.log(result.data)
            //  console.log(optionList)

        }

    })

    const ChangeConecta = (async (event) => {

        if (event === '0') {
            setOptionListDetalleEstado(true)
            setOptionListDetalleEstadoSelect('0')
            setSelectedLlamada('0')
        } else {
            const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Campaign/Colas', { dato: event }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

             setSelectedLlamada(event)

            if (result.status === 200) {

                setOptionListDetalle(result.data)
                setOptionListDetalleEstado(false)

            }
        }


    })

    const ChangeConectaDetalle = (async (event) => {

        if (event === '0') {
            setOptionListDetalleEstadoCargas(true)
            setOptionListDetalleEstadoSelectCargas('0')
            setSelectedLlamadaDetalleCarga('0')
        } else {
            const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Campaign/Colas/Cargas', { dato: event }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

            setSelectedLlamadaDetalle(event)

            if (result.status === 200) {

                setOptionListDetalleCarga(result.data)
                setOptionListDetalleEstadoCargas(false)

            }
        }
    })
    const ChangeConectaDetalleCarga = (async (event) => {

        setOptionListDetalleEstado(false)
        setOptionListDetalleEstadoSelect(false)
        setOptionListDetalleEstadoSelectCargas(event)
        setSelectedLlamadaDetalleCarga(event)

    })


    return (

        <>
            <div className="row mb-2">
              
                <div className="col-sm-12 col-md-12 col-lg-2">
                    <select className="form-control form-select" id="ddl_company"
                        disabled={false}
                        // value={select}
                        onChange={(e) => (ChangeConecta(e.target.value))}>
                        <option value="0">Compañia</option>
                        {optionList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.detalle}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-2 mt-sm-2 mt-lg-0">
                    <select className="form-control form-select" id="ddl_campana"
                        disabled={optionListDetalleEstado}
                        // value={optionListDetalleEstadoSelect}
                        onChange={(e) => (ChangeConectaDetalle(e.target.value))}
                    >
                        <option value="0">Campaña</option>
                        {optionListDetalle.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.detalle}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-2 mt-sm-2 mt-lg-0">
                    <select className="form-control form-select" id="ddl_carga"
                        disabled={optionListDetalleEstadoCargas}
                         value={optionListDetalleEstadoSelectCargas}
                        onChange={(e) => (ChangeConectaDetalleCarga(e.target.value))}
                    >
                        <option value="0">Carga</option>
                        {optionListDetalleCarga.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.detalle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}
export default Company_Campaing_Colas_Campana