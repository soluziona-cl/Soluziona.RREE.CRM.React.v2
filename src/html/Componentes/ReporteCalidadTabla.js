import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Modal } from "./Modal";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";

function ReporteCalidadTabla({ flujo, campana, ini, fin }) {

    const [datafull, setData] = useState([]);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const sesiones = {
        sgui: localStorage.getItem("localgui"),
        scliente: localStorage.getItem("localcliente"),
        sid: localStorage.getItem("localid"),
        sid_usuario: localStorage.getItem("localid_usuario"),
        stoken: localStorage.getItem("token")
    };

    function secondsToString(seconds) {
        var hour = Math.floor(seconds / 3600);
        hour = hour < 10 ? "0" + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = minute < 10 ? "0" + minute : minute;
        var second = seconds % 60;
        second = second < 10 ? "0" + second : second;
        return hour + ":" + minute + ":" + second;
    }

    const handleOnExportAgente = () => {

        //creates a new workbook
        let wb = XLSX.utils.book_new();

        var arr2 = datafull.map(v => ({
            intervalo: v.intervalo,
            recibidas: v.recibidas,
            contestadas: v.contestadas,
            abandonadas: v.abandonadas,
            natencion: v.natencion,
            nservicio: v.nservicio,
            nabandono: 100 - v.natencion,
            tmo: secondsToString(parseInt(v.tmo))
        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Agente");
        XLSX.writeFile(wb, "Gestion_Agente_" + date + ".xlsx");
    };


    useEffect(() => {
        const token = getToken();
        const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }

        axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(false);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(false);
            });

        Datos()

    }, []);

    const Datos = (async () => {

        console.log({ flujo })
        console.log({ campana })
        console.log({ ini })
        console.log({ fin })



        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/DetalleCargas/CargasDetalleResumenDash/Full', { dato: flujo }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)
            setData(result.data);
        }

    })


    return (<>
        <section className="float-end">
            <button onClick={handleOnExportAgente} className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary text-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" >
                <i className="fa-solid fa-file-excel mr-2" > </i> Exportar </button> </section> <div className="mt-5" >

            <table className="table">
                <thead>
                    <tr>
                        <th> Agente </th> <th> Realizadas </th> <th> Conectadas </th> <th> No Conectadas </th> <th> Compromisos de Pago </th> <th> Hablado </th> <th> Pausas </th> <th> En Espera </th> <th> TMO </th>

                    </tr> </thead> <tbody> {
                        datafull.map((data, index) => (<tr key={index}>
                            <td> {data.fecha} </td>
                            <td> {data.recibidas} </td>
                            <td> {data.contestadas} </td>
                            <td> {data.abandonadas} </td>
                            <td> - </td>
                            <td> {data.contestadas / data.recibidas} </td>
                            <td> {data.abandonadas / data.contestadas} </td>
                            <td> {secondsToString(parseInt(data.tmo))} </td>
                            <td> {secondsToString(parseInt(data.tmo))} </td>
                        </tr>
                        ))
                    } </tbody> </table>

        </div> </>
    )
}
export default ReporteCalidadTabla