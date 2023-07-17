import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import ClockLoader from "react-spinners/ClockLoader";

function ReporteResumenFlujoLlamadaTabla({ flujo, ini, fin, nombre }) {

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
    const [_1, set_1] = useState(false);
    const [_2, set_2] = useState(false);
    const [_3, set_3] = useState(false);
    const [_4, set_4] = useState(false);
    const [_5, set_5] = useState(false);
    const [_6, set_6] = useState(false);
    const [_7, set_7] = useState(false);
    const [_8, set_8] = useState(false);
    const [_9, set_9] = useState(false);
    const [_10, set_10] = useState(false);
    const [_11, set_11] = useState(false);
    const [_12, set_12] = useState(false);
    const [_13, set_13] = useState(false);
    const [_14, set_14] = useState(false);
    const [_15, set_15] = useState(false);
    const [_16, set_16] = useState(false);
    const [_17, set_17] = useState(false);
    const [_18, set_18] = useState(false);
    const [_19, set_19] = useState(false);
    const [_20, set_20] = useState(false);
    const [_21, set_21] = useState(false);
    const [_22, set_22] = useState(false);
    const [_23, set_23] = useState(false);
    const [_24, set_24] = useState(false);
    const [_25, set_25] = useState(false);
    const [_26, set_26] = useState(false);
    const [_27, set_27] = useState(false);
    const [_28, set_28] = useState(false);
    const [_29, set_29] = useState(false);
    const [_30, set_30] = useState(false);
    const [_31, set_31] = useState(false);

    function secondsToString(seconds) {
        var hour = Math.floor(seconds / 3600);
        hour = hour < 10 ? "0" + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = minute < 10 ? "0" + minute : minute;
        var second = seconds % 60;
        second = second < 10 ? "0" + second : second;
        return hour + ":" + minute + ":" + second;
    }

    const handleOnExportCarga = () => {

        //creates a new workbook
        let wb = XLSX.utils.book_new();

        var arr2 = datafull.map(v => ({
            Tipo_Cliente: v.habilidad,
            Detalle: v.operacion,
            Total: ((parseInt((v._1 === null) ? 0 : v._1) +
                parseInt((v._2 === null) ? 0 : v._2) +
                parseInt((v._3 === null) ? 0 : v._3) +
                parseInt((v._4 === null) ? 0 : v._4) +
                parseInt((v._5 === null) ? 0 : v._5) +
                parseInt((v._6 === null) ? 0 : v._6) +
                parseInt((v._7 === null) ? 0 : v._7) +
                parseInt((v._8 === null) ? 0 : v._8) +
                parseInt((v._9 === null) ? 0 : v._9) +
                parseInt((v._10 === null) ? 0 : v._10) +
                parseInt((v._11 === null) ? 0 : v._11) +
                parseInt((v._12 === null) ? 0 : v._12) +
                parseInt((v._13 === null) ? 0 : v._13) +
                parseInt((v._14 === null) ? 0 : v._14) +
                parseInt((v._15 === null) ? 0 : v._15) +
                parseInt((v._16 === null) ? 0 : v._16) +
                parseInt((v._17 === null) ? 0 : v._17) +
                parseInt((v._18 === null) ? 0 : v._18) +
                parseInt((v._19 === null) ? 0 : v._19) +
                parseInt((v._20 === null) ? 0 : v._20) +
                parseInt((v._21 === null) ? 0 : v._21) +
                parseInt((v._22 === null) ? 0 : v._22) +
                parseInt((v._23 === null) ? 0 : v._23) +
                parseInt((v._24 === null) ? 0 : v._24) +
                parseInt((v._25 === null) ? 0 : v._25) +
                parseInt((v._26 === null) ? 0 : v._26) +
                parseInt((v._27 === null) ? 0 : v._27) +
                parseInt((v._28 === null) ? 0 : v._28) +
                parseInt((v._29 === null) ? 0 : v._29) +
                parseInt((v._30 === null) ? 0 : v._30) +
                parseInt((v._31 === null) ? 0 : v._31))),
            _1: v._1,
            _2: v._2,
            _3: v._3,
            _4: v._4,
            _5: v._5,
            _6: v._6,
            _7: v._7,
            _8: v._8,
            _9: v._9,
            _10: v._10,
            _11: v._11,
            _12: v._12,
            _13: v._13,
            _14: v._14,
            _15: v._15,
            _16: v._16,
            _17: v._17,
            _18: v._18,
            _19: v._19,
            _20: v._20,
            _21: v._21,
            _22: v._22,
            _23: v._23,
            _24: v._24,
            _25: v._25,
            _26: v._26,
            _27: v._27,
            _28: v._28,
            _29: v._29,
            _30: v._30,
            _31: v._31,
            // RUT_PERSONA: v.ruT_PERSONA,
            // This_Phone_number: v.this_Phone_number,
            // Call_Disposition: v.call_Disposition,
            // Call_Time: v.call_Time,
            // Dialing_Duration: v.dialing_Duration,
            // Answered_Duration: v.answered_Duration,
            // Agent: v.agent,
            // Recording_file: v.recording_file,
            // Global_Interaction_ID: v.global_Interaction_ID,
            // List_name: v.list_name
        }));

        let ws = XLSX.utils.json_to_sheet(arr2);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws, "Carga");
        XLSX.writeFile(wb, "ReporteResumenGestion_" + date + ".xlsx");
    };

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        // setTimeout(() => {
        //     setLoading(false)
        // }, 2000)
    }, [])


    useEffect(() => {

        const token = getToken();
        const rutaservidor = "/Orkesta/CallSouth/LosHeroes/CRM"
        if (!token) {
            // console.log('Vacio')
            navigate(rutaservidor);
            return;
        }


        axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/Session_check', { user: sesiones.sid_usuario, gui: sesiones.sgui }, { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })
            .then(response => {

                setUserSession(sesiones.sgui, sesiones.sid_usuario);
                setAuthLoading(true);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(true);
            });

        Datos()

    }, []);

    const getTotals = (data, key) => {
        let total = 0;
        data.forEach(item => {
            total += (item[key] === null) ? 0 : parseInt(item[key]);
        });
        return total;
    };

    const Datos = (async () => {


        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/Aporta/API_Aporta_RegistroCivil_CRM/api/Ventas_CRM/CRM/DashTrafico/Tipificaciones/Full/Reporte',
            { dato: ini, dato_1: fin,dato_2: flujo },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            console.log(result.data)

            const resultado = result.data.reduce((acumulador, valorActual) => {
                const categoria = valorActual.habilidad;
                if (!acumulador[categoria]) {
                  acumulador[categoria] = {
                    categoria,
                    _15: 0,
                    _20: 0,
                    _21: 0,
                    _23: 0,
                  };
                }
                acumulador[categoria]._15 += valorActual._15;
                acumulador[categoria]._20 += valorActual._20;
                acumulador[categoria]._21 += valorActual._21;
                acumulador[categoria]._23 += valorActual._23;
                return acumulador;
              }, {});
              
              console.log(resultado);


            result.data.push({
                habilidad: "Total",
                operacion: "",
                _1: getTotals(result.data, "_1"),
                _2: getTotals(result.data, "_2"),
                _3: getTotals(result.data, "_3"),
                _4: getTotals(result.data, "_4"),
                _5: getTotals(result.data, "_5"),
                _6: getTotals(result.data, "_6"),
                _7: getTotals(result.data, "_7"),
                _8: getTotals(result.data, "_8"),
                _9: getTotals(result.data, "_9"),
                _10: getTotals(result.data, "_10"),
                _11: getTotals(result.data, "_11"),
                _12: getTotals(result.data, "_12"),
                _13: getTotals(result.data, "_13"),
                _14: getTotals(result.data, "_14"),
                _15: getTotals(result.data, "_15"),
                _16: getTotals(result.data, "_16"),
                _17: getTotals(result.data, "_17"),
                _18: getTotals(result.data, "_18"),
                _19: getTotals(result.data, "_19"),
                _20: getTotals(result.data, "_20"),
                _21: getTotals(result.data, "_21"),
                _22: getTotals(result.data, "_22"),
                _23: getTotals(result.data, "_23"),
                _24: getTotals(result.data, "_24"),
                _25: getTotals(result.data, "_25"),
                _26: getTotals(result.data, "_26"),
                _27: getTotals(result.data, "_27"),
                _28: getTotals(result.data, "_28"),
                _29: getTotals(result.data, "_29"),
                _30: getTotals(result.data, "_30"),
                _31: getTotals(result.data, "_31"),
                t_1: getTotals(result.data, "_1"),
                t_2: getTotals(result.data, "_2"),
                t_3: getTotals(result.data, "_3"),
                t_4: getTotals(result.data, "_4"),
                t_5: getTotals(result.data, "_5"),
                t_6: getTotals(result.data, "_6"),
                t_7: getTotals(result.data, "_7"),
                t_8: getTotals(result.data, "_8"),
                t_9: getTotals(result.data, "_9"),
                t_10: getTotals(result.data, "_10"),
                t_11: getTotals(result.data, "_11"),
                t_12: getTotals(result.data, "_12"),
                t_13: getTotals(result.data, "_13"),
                t_14: getTotals(result.data, "_14"),
                t_15: getTotals(result.data, "_15"),
                t_16: getTotals(result.data, "_16"),
                t_17: getTotals(result.data, "_17"),
                t_18: getTotals(result.data, "_18"),
                t_19: getTotals(result.data, "_19"),
                t_20: getTotals(result.data, "_20"),
                t_21: getTotals(result.data, "_21"),
                t_22: getTotals(result.data, "_22"),
                t_23: getTotals(result.data, "_23"),
                t_24: getTotals(result.data, "_24"),
                t_25: getTotals(result.data, "_25"),
                t_26: getTotals(result.data, "_26"),
                t_27: getTotals(result.data, "_27"),
                t_28: getTotals(result.data, "_28"),
                t_29: getTotals(result.data, "_29"),
                t_30: getTotals(result.data, "_30"),
                t_31: getTotals(result.data, "_31"),


            });

         
            setData(result.data);
            setLoading(false)
        }
        else { setLoading(false) }
    })

   
    const customStyles = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '50px',
                border: '1px solid #a9dff0',
                borderRadius: '3px'
            },
            striped: {
                backgroundColor: '#a9dff0',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#a9dff0',

            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize: '14px',

            },

        },

    };

    const columns = [
        {
            name: <div className="text-wrap">Habilidad</div>,
            selector: row => row.habilidad,
            center: true
        },
        {
            name: <div className="text-wrap">Operacion</div>,
            selector: row => row.operacion,
            center: true,
            wrap: false,
        }
        ,
        {
            name: <div className="text-wrap">Total</div>,
            selector: row => (parseInt((row._1 === null) ? 0 : row._1) +
                parseInt((row._2 === null) ? 0 : row._2) +
                parseInt((row._3 === null) ? 0 : row._3) +
                parseInt((row._4 === null) ? 0 : row._4) +
                parseInt((row._5 === null) ? 0 : row._5) +
                parseInt((row._6 === null) ? 0 : row._6) +
                parseInt((row._7 === null) ? 0 : row._7) +
                parseInt((row._8 === null) ? 0 : row._8) +
                parseInt((row._9 === null) ? 0 : row._9) +
                parseInt((row._10 === null) ? 0 : row._10) +
                parseInt((row._11 === null) ? 0 : row._11) +
                parseInt((row._12 === null) ? 0 : row._12) +
                parseInt((row._13 === null) ? 0 : row._13) +
                parseInt((row._14 === null) ? 0 : row._14) +
                parseInt((row._15 === null) ? 0 : row._15) +
                parseInt((row._16 === null) ? 0 : row._16) +
                parseInt((row._17 === null) ? 0 : row._17) +
                parseInt((row._18 === null) ? 0 : row._18) +
                parseInt((row._19 === null) ? 0 : row._19) +
                parseInt((row._20 === null) ? 0 : row._20) +
                parseInt((row._21 === null) ? 0 : row._21) +
                parseInt((row._22 === null) ? 0 : row._22) +
                parseInt((row._23 === null) ? 0 : row._23) +
                parseInt((row._24 === null) ? 0 : row._24) +
                parseInt((row._25 === null) ? 0 : row._25) +
                parseInt((row._26 === null) ? 0 : row._26) +
                parseInt((row._27 === null) ? 0 : row._27) +
                parseInt((row._28 === null) ? 0 : row._28) +
                parseInt((row._29 === null) ? 0 : row._29) +
                parseInt((row._30 === null) ? 0 : row._30) +
                parseInt((row._31 === null) ? 0 : row._31)),
            center: true
        },
        { name: <div className="text-wrap">01{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_1 === 0) ? set_1(true) : row._1, center: true, omit: _1 },
        { name: <div className="text-wrap">02{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_2 === 0) ? set_2(true) : row._2, center: true, omit: _2 },
        { name: <div className="text-wrap">03{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_3 === 0) ? set_3(true) : row._3, center: true, omit: _3 },
        { name: <div className="text-wrap">04{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_4 === 0) ? set_4(true) : row._4, center: true, omit: _4 },
        { name: <div className="text-wrap">05{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_5 === 0) ? set_5(true) : row._5, center: true, omit: _5 },
        { name: <div className="text-wrap">06{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_6 === 0) ? set_6(true) : row._6, center: true, omit: _6 },
        { name: <div className="text-wrap">07{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_7 === 0) ? set_7(true) : row._7, center: true, omit: _7 },
        { name: <div className="text-wrap">08{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_8 === 0) ? set_8(true) : row._8, center: true, omit: _8 },
        { name: <div className="text-wrap">09{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_9 === 0) ? set_9(true) : row._9, center: true, omit: _9 },
        { name: <div className="text-wrap">10{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_10 === 0) ? set_10(true) : row._10, center: true, omit: _10 },
        { name: <div className="text-wrap">11{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_11 === 0) ? set_11(true) : row._11, center: true, omit: _11 },
        { name: <div className="text-wrap">12{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_12 === 0) ? set_12(true) : row._12, center: true, omit: _12 },
        { name: <div className="text-wrap">13{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_13 === 0) ? set_13(true) : row._13, center: true, omit: _13 },
        { name: <div className="text-wrap">14{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_14 === 0) ? set_14(true) : row._14, center: true, omit: _14 },
        { name: <div className="text-wrap">15{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_15 === 0) ? set_15(true) : row._15, center: true, omit: _15 },
        { name: <div className="text-wrap">16{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_16 === 0) ? set_16(true) : row._16, center: true, omit: _16 },
        { name: <div className="text-wrap">17{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_17 === 0) ? set_17(true) : row._17, center: true, omit: _17 },
        { name: <div className="text-wrap">18{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_18 === 0) ? set_18(true) : row._18, center: true, omit: _18 },
        { name: <div className="text-wrap">19{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_19 === 0) ? set_19(true) : row._19, center: true, omit: _19 },
        { name: <div className="text-wrap">20{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_20 === 0) ? set_20(true) : row._20, center: true, omit: _20 },
        { name: <div className="text-wrap">21{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_21 === 0) ? set_21(true) : row._21, center: true, omit: _21 },
        { name: <div className="text-wrap">22{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_22 === 0) ? set_22(true) : row._22, center: true, omit: _22 },
        { name: <div className="text-wrap">23{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_23 === 0) ? set_23(true) : row._23, center: true, omit: _23 },
        { name: <div className="text-wrap">24{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_24 === 0) ? set_24(true) : row._24, center: true, omit: _24 },
        { name: <div className="text-wrap">25{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_25 === 0) ? set_25(true) : row._25, center: true, omit: _25 },
        { name: <div className="text-wrap">26{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_26 === 0) ? set_26(true) : row._26, center: true, omit: _26 },
        { name: <div className="text-wrap">27{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_27 === 0) ? set_27(true) : row._27, center: true, omit: _27 },
        { name: <div className="text-wrap">28{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_28 === 0) ? set_28(true) : row._28, center: true, omit: _28 },
        { name: <div className="text-wrap">29{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_29 === 0) ? set_29(true) : row._29, center: true, omit: _29 },
        { name: <div className="text-wrap">30{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_30 === 0) ? set_30(true) : row._30, center: true, omit: _30 },
        { name: <div className="text-wrap">31{"/" + ini.substring(4, 6) + "/" + ini.slice(0, 4)}</div>, selector: row => (row.t_31 === 0) ? set_31(true) : row._31, center: true, omit: _31 },
    ];


    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Trafico</h4>
                            </div>
                            <div className="card-body">

                                {loading ? (
                                    <div className="d-flex justify-content-center mt-3">
                                        <ClockLoader
                                            className='loading'
                                            color={'#5b198ab5'}
                                            loading={loading}
                                            size={60}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>

                                ) : (
                                    <div className="mb-2">
                                        <section className=" float-start">
                                            <button
                                                onClick={handleOnExportCarga}
                                                className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                                <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                            </button>
                                        </section>
                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            // highlightOnHover
                                            striped
                                            customStyles={customStyles}

                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}
export default ReporteResumenFlujoLlamadaTabla