import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getToken, removeUserSession, setUserSession } from './Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from "xlsx";
import DotLoader from "react-spinners/DotLoader";

function ReporteResultanteCampanaTabla({ campanas, cargas }) {

    const [datafull, setData] = useState([]);
    const [datafullresult, setDataResult] = useState([]);
    const [datafullresultdash, setDataResultDash] = useState([]);

    const [columns, setColumns] = useState([]);
    const [columsnNormal, setColumnsNormal] = useState([
        // { name: <div className="text-wrap">AO</div>, selector: row => row.ao, center: true, wrap: true },
        // { name: <div className="text-wrap">AO MES</div>, selector: row => row.ao_mes, center: true, wrap: true },
        // { name: <div className="text-wrap">MES</div>, selector: row => row.mes, center: true, wrap: true },
        // { name: <div className="text-wrap">HORA</div>, selector: row => row.hora, center: true, wrap: true },
        // { name: <div className="text-wrap">MINUTOS</div>, selector: row => row.minutos, center: true, wrap: true },
        // { name: <div className="text-wrap">AAAAMMDD</div>, selector: row => row.aaaammdd, center: true, wrap: true },
        { name: <div className="text-wrap">INDICE</div>, selector: row => row.indice, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE BASE</div>, selector: row => row.nombre_base, center: true, wrap: true },
        { name: <div className="text-wrap">RUT</div>, selector: row => row.rut, center: true, wrap: true },
        { name: <div className="text-wrap">DV</div>, selector: row => row.dv, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE PRIMERO</div>, selector: row => row.nombre_primero, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE SEGUNDO</div>, selector: row => row.nombre_segundo, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO PATERNO</div>, selector: row => row.apellido_paterno, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO MATERNO</div>, selector: row => row.apellido_materno, center: true, wrap: true },
        { name: <div className="text-wrap">SUCURSAL</div>, selector: row => row.sucursal, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA NAC</div>, selector: row => row.fecha_nac, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA INGRESO CAJA</div>, selector: row => row.fechaingreso_caja, center: true, wrap: true },
        { name: <div className="text-wrap">EMAIL</div>, selector: row => row.email, center: true, wrap: true },
        { name: <div className="text-wrap">DIRECCION</div>, selector: row => row.direccion, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">NUMERO</div>, selector: row => row.numero, center: true, wrap: true },
        { name: <div className="text-wrap">VILLA</div>, selector: row => row.villa, center: true, wrap: true },
        { name: <div className="text-wrap">COMUNA</div>, selector: row => row.comuna, center: true, wrap: true },
        { name: <div className="text-wrap">CIUDAD</div>, selector: row => row.ciudad, center: true, wrap: true },
        { name: <div className="text-wrap">REGION</div>, selector: row => row.region, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE EMPRESA EPP</div>, selector: row => row.nombre_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">RUT EMPRESA EPP</div>, selector: row => row.rut_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">CAMPANA</div>, selector: row => row.campana, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">PREAPROBADO</div>, selector: row => row.preaprobado, center: true, wrap: true },
        { name: <div className="text-wrap">VALOR CUOTA</div>, selector: row => row.valor_cuota, center: true, wrap: true },
        { name: <div className="text-wrap">PLAZO</div>, selector: row => row.plazo, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO LIQUIDO</div>, selector: row => row.monto_liquido, center: true, wrap: true },
        { name: <div className="text-wrap">CAE</div>, selector: row => row.cae, center: true, wrap: true },
        { name: <div className="text-wrap">TASA</div>, selector: row => row.tasa, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO FINAL</div>, selector: row => row.monto_final, center: true, wrap: true },
        { name: <div className="text-wrap">FONO CONTACTO</div>, selector: row => row.fono_contacto, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA</div>, selector: row => row.fecha, center: true, wrap: true },
        { name: <div className="text-wrap">AGENTE</div>, selector: row => row.agente, center: true, wrap: true },
        { name: <div className="text-wrap">OBSERVACION</div>, selector: row => row.observacion, center: true, wrap: true },
        { name: <div className="text-wrap">DURATION</div>, selector: row => row.duration, center: true, wrap: true },
        { name: <div className="text-wrap">GRABACION</div>, selector: row => row.grabacion, center: true, wrap: false, width: '650px', },
        { name: <div className="text-wrap">CATEGORIA</div>, selector: row => row.categoria, center: true, wrap: true },
        { name: <div className="text-wrap">RESOLUCION</div>, selector: row => row.resolucion, center: true, wrap: true },
        { name: <div className="text-wrap">SUBCATEGORIA</div>, selector: row => row.subcategoria, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 1</div>, selector: row => row.telefono_1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X1</div>, selector: row => row.marca_x1, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X1</div>, selector: row => row.fecha_x1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 1</div>, selector: row => row.marca_ejecutivo_1, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 2</div>, selector: row => row.telefono_2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X2</div>, selector: row => row.marca_x2, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X2</div>, selector: row => row.fecha_x2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 2</div>, selector: row => row.marca_ejecutivo_2, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 3</div>, selector: row => row.telefono_3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X3</div>, selector: row => row.marca_x3, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X3</div>, selector: row => row.fecha_x3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 3</div>, selector: row => row.marca_ejecutivo_3, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 4</div>, selector: row => row.telefono_4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X4</div>, selector: row => row.marca_x4, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X4</div>, selector: row => row.fecha_x4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 4</div>, selector: row => row.marca_ejecutivo_4, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 5</div>, selector: row => row.telefono_5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X5</div>, selector: row => row.marca_x5, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X5</div>, selector: row => row.fecha_x5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 5</div>, selector: row => row.marca_ejecutivo_5, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 6</div>, selector: row => row.telefono_6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X6</div>, selector: row => row.marca_x6, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X6</div>, selector: row => row.fecha_x6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 6</div>, selector: row => row.marca_ejecutivo_6, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 7</div>, selector: row => row.telefono_7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X7</div>, selector: row => row.marca_x7, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X7</div>, selector: row => row.fecha_x7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 7</div>, selector: row => row.marca_ejecutivo_7, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 8</div>, selector: row => row.telefono_8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X8</div>, selector: row => row.marca_x8, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X8</div>, selector: row => row.fecha_x8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 8</div>, selector: row => row.marca_ejecutivo_8, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 9</div>, selector: row => row.telefono_9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X9</div>, selector: row => row.marca_x9, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X9</div>, selector: row => row.fecha_x9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 9</div>, selector: row => row.marca_ejecutivo_9, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 10</div>, selector: row => row.telefono_10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X10</div>, selector: row => row.marca_x10, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X10</div>, selector: row => row.fecha_x10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 10</div>, selector: row => row.marca_ejecutivo_10, center: true, wrap: true },

    ]);
    const [columsnFaseA, setColumnsFaseA] = useState([
        // { name: <div className="text-wrap">AO</div>, selector: row => row.ao, center: true, wrap: true },
        // { name: <div className="text-wrap">AO MES</div>, selector: row => row.ao_mes, center: true, wrap: true },
        // { name: <div className="text-wrap">MES</div>, selector: row => row.mes, center: true, wrap: true },
        // { name: <div className="text-wrap">HORA</div>, selector: row => row.hora, center: true, wrap: true },
        // { name: <div className="text-wrap">MINUTOS</div>, selector: row => row.minutos, center: true, wrap: true },
        // { name: <div className="text-wrap">AAAAMMDD</div>, selector: row => row.aaaammdd, center: true, wrap: true },
        { name: <div className="text-wrap">INDICE</div>, selector: row => row.indice, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE BASE</div>, selector: row => row.nombre_base, center: true, wrap: true },
        { name: <div className="text-wrap">RUT</div>, selector: row => row.rut, center: true, wrap: true },
        { name: <div className="text-wrap">DV</div>, selector: row => row.dv, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE PRIMERO</div>, selector: row => row.nombre_primero, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE SEGUNDO</div>, selector: row => row.nombre_segundo, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO PATERNO</div>, selector: row => row.apellido_paterno, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO MATERNO</div>, selector: row => row.apellido_materno, center: true, wrap: true },
        { name: <div className="text-wrap">SUCURSAL</div>, selector: row => row.sucursal, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA NAC</div>, selector: row => row.fecha_nac, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA INGRESO CAJA</div>, selector: row => row.fechaingreso_caja, center: true, wrap: true },
        { name: <div className="text-wrap">EMAIL</div>, selector: row => row.email, center: true, wrap: true },
        { name: <div className="text-wrap">DIRECCION</div>, selector: row => row.direccion, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">NUMERO</div>, selector: row => row.numero, center: true, wrap: true },
        { name: <div className="text-wrap">VILLA</div>, selector: row => row.villa, center: true, wrap: true },
        { name: <div className="text-wrap">COMUNA</div>, selector: row => row.comuna, center: true, wrap: true },
        { name: <div className="text-wrap">CIUDAD</div>, selector: row => row.ciudad, center: true, wrap: true },
        { name: <div className="text-wrap">REGION</div>, selector: row => row.region, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE EMPRESA EPP</div>, selector: row => row.nombre_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">RUT EMPRESA EPP</div>, selector: row => row.rut_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">CAMPANA</div>, selector: row => row.campana, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">PREAPROBADO</div>, selector: row => row.preaprobado, center: true, wrap: true },
        { name: <div className="text-wrap">VALOR CUOTA</div>, selector: row => row.valor_cuota, center: true, wrap: true },
        { name: <div className="text-wrap">PLAZO</div>, selector: row => row.plazo, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO LIQUIDO</div>, selector: row => row.monto_liquido, center: true, wrap: true },
        { name: <div className="text-wrap">CAE</div>, selector: row => row.cae, center: true, wrap: true },
        { name: <div className="text-wrap">TASA</div>, selector: row => row.tasa, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO FINAL</div>, selector: row => row.monto_final, center: true, wrap: true },
        { name: <div className="text-wrap">FONO CONTACTO</div>, selector: row => row.fono_contacto, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA</div>, selector: row => row.fecha, center: true, wrap: true },
        { name: <div className="text-wrap">AGENTE</div>, selector: row => row.agente, center: true, wrap: true },
        { name: <div className="text-wrap">OBSERVACION</div>, selector: row => row.observacion, center: true, wrap: true },
        { name: <div className="text-wrap">DURATION</div>, selector: row => row.duration, center: true, wrap: true },
        { name: <div className="text-wrap">GRABACION</div>, selector: row => row.grabacion, center: true, wrap: false, width: '650px', },
        { name: <div className="text-wrap">CATEGORIA</div>, selector: row => row.categoria, center: true, wrap: true },
        { name: <div className="text-wrap">RESOLUCION</div>, selector: row => row.resolucion, center: true, wrap: true },
        { name: <div className="text-wrap">SUBCATEGORIA</div>, selector: row => row.subcategoria, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 1</div>, selector: row => row.telefono_1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X1</div>, selector: row => row.marca_x1, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X1</div>, selector: row => row.fecha_x1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 1</div>, selector: row => row.marca_ejecutivo_1, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 2</div>, selector: row => row.telefono_2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X2</div>, selector: row => row.marca_x2, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X2</div>, selector: row => row.fecha_x2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 2</div>, selector: row => row.marca_ejecutivo_2, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 3</div>, selector: row => row.telefono_3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X3</div>, selector: row => row.marca_x3, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X3</div>, selector: row => row.fecha_x3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 3</div>, selector: row => row.marca_ejecutivo_3, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 4</div>, selector: row => row.telefono_4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X4</div>, selector: row => row.marca_x4, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X4</div>, selector: row => row.fecha_x4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 4</div>, selector: row => row.marca_ejecutivo_4, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 5</div>, selector: row => row.telefono_5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X5</div>, selector: row => row.marca_x5, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X5</div>, selector: row => row.fecha_x5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 5</div>, selector: row => row.marca_ejecutivo_5, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 6</div>, selector: row => row.telefono_6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X6</div>, selector: row => row.marca_x6, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X6</div>, selector: row => row.fecha_x6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 6</div>, selector: row => row.marca_ejecutivo_6, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 7</div>, selector: row => row.telefono_7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X7</div>, selector: row => row.marca_x7, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X7</div>, selector: row => row.fecha_x7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 7</div>, selector: row => row.marca_ejecutivo_7, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 8</div>, selector: row => row.telefono_8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X8</div>, selector: row => row.marca_x8, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X8</div>, selector: row => row.fecha_x8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 8</div>, selector: row => row.marca_ejecutivo_8, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 9</div>, selector: row => row.telefono_9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X9</div>, selector: row => row.marca_x9, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X9</div>, selector: row => row.fecha_x9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 9</div>, selector: row => row.marca_ejecutivo_9, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 10</div>, selector: row => row.telefono_10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X10</div>, selector: row => row.marca_x10, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X10</div>, selector: row => row.fecha_x10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 10</div>, selector: row => row.marca_ejecutivo_10, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 01</div>, selector: row => row.preg01, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 02</div>, selector: row => row.preg02, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 03</div>, selector: row => row.preg03, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 04</div>, selector: row => row.preg04, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 05</div>, selector: row => row.preg05, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 06</div>, selector: row => row.preg06, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 07</div>, selector: row => row.preg07, center: true, wrap: true },
        { name: <div className="text-wrap">PREG 08</div>, selector: row => row.preg08, center: true, wrap: true },
        { name: <div className="text-wrap">OBSERVACION ENCUESTA</div>, selector: row => row.observacionencuesta, center: true, wrap: true },

    ]);
    const [columsnReforzamiento, setColumnsReforzamiento] = useState([
        // { name: <div className="text-wrap">AO</div>, selector: row => row.ao, center: true, wrap: true },
        // { name: <div className="text-wrap">AO MES</div>, selector: row => row.ao_mes, center: true, wrap: true },
        // { name: <div className="text-wrap">MES</div>, selector: row => row.mes, center: true, wrap: true },
        // { name: <div className="text-wrap">HORA</div>, selector: row => row.hora, center: true, wrap: true },
        // { name: <div className="text-wrap">MINUTOS</div>, selector: row => row.minutos, center: true, wrap: true },
        // { name: <div className="text-wrap">AAAAMMDD</div>, selector: row => row.aaaammdd, center: true, wrap: true },
        { name: <div className="text-wrap">INDICE</div>, selector: row => row.indice, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE BASE</div>, selector: row => row.nombre_base, center: true, wrap: true },
        { name: <div className="text-wrap">RUT</div>, selector: row => row.rut, center: true, wrap: true },
        { name: <div className="text-wrap">DV</div>, selector: row => row.dv, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE PRIMERO</div>, selector: row => row.nombre_primero, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE SEGUNDO</div>, selector: row => row.nombre_segundo, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO PATERNO</div>, selector: row => row.apellido_paterno, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO MATERNO</div>, selector: row => row.apellido_materno, center: true, wrap: true },
        { name: <div className="text-wrap">SUCURSAL</div>, selector: row => row.sucursal, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA NAC</div>, selector: row => row.fecha_nac, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA INGRESO CAJA</div>, selector: row => row.fechaingreso_caja, center: true, wrap: true },
        { name: <div className="text-wrap">EMAIL</div>, selector: row => row.email, center: true, wrap: true },
        { name: <div className="text-wrap">DIRECCION</div>, selector: row => row.direccion, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">NUMERO</div>, selector: row => row.numero, center: true, wrap: true },
        { name: <div className="text-wrap">VILLA</div>, selector: row => row.villa, center: true, wrap: true },
        { name: <div className="text-wrap">COMUNA</div>, selector: row => row.comuna, center: true, wrap: true },
        { name: <div className="text-wrap">CIUDAD</div>, selector: row => row.ciudad, center: true, wrap: true },
        { name: <div className="text-wrap">REGION</div>, selector: row => row.region, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE EMPRESA EPP</div>, selector: row => row.nombre_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">RUT EMPRESA EPP</div>, selector: row => row.rut_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">CAMPANA</div>, selector: row => row.campana, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">PREAPROBADO</div>, selector: row => row.preaprobado, center: true, wrap: true },
        { name: <div className="text-wrap">VALOR CUOTA</div>, selector: row => row.valor_cuota, center: true, wrap: true },
        { name: <div className="text-wrap">PLAZO</div>, selector: row => row.plazo, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO LIQUIDO</div>, selector: row => row.monto_liquido, center: true, wrap: true },
        { name: <div className="text-wrap">CAE</div>, selector: row => row.cae, center: true, wrap: true },
        { name: <div className="text-wrap">TASA</div>, selector: row => row.tasa, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO FINAL</div>, selector: row => row.monto_final, center: true, wrap: true },
        { name: <div className="text-wrap">FONO CONTACTO</div>, selector: row => row.fono_contacto, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA</div>, selector: row => row.fecha, center: true, wrap: true },
        { name: <div className="text-wrap">AGENTE</div>, selector: row => row.agente, center: true, wrap: true },
        { name: <div className="text-wrap">OBSERVACION</div>, selector: row => row.observacion, center: true, wrap: true },
        { name: <div className="text-wrap">DURATION</div>, selector: row => row.duration, center: true, wrap: true },
        { name: <div className="text-wrap">GRABACION</div>, selector: row => row.grabacion, center: true, wrap: false, width: '650px', },
        { name: <div className="text-wrap">CATEGORIA</div>, selector: row => row.categoria, center: true, wrap: true },
        { name: <div className="text-wrap">RESOLUCION</div>, selector: row => row.resolucion, center: true, wrap: true },
        { name: <div className="text-wrap">SUBCATEGORIA</div>, selector: row => row.subcategoria, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 1</div>, selector: row => row.telefono_1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X1</div>, selector: row => row.marca_x1, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X1</div>, selector: row => row.fecha_x1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 1</div>, selector: row => row.marca_ejecutivo_1, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 2</div>, selector: row => row.telefono_2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X2</div>, selector: row => row.marca_x2, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X2</div>, selector: row => row.fecha_x2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 2</div>, selector: row => row.marca_ejecutivo_2, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 3</div>, selector: row => row.telefono_3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X3</div>, selector: row => row.marca_x3, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X3</div>, selector: row => row.fecha_x3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 3</div>, selector: row => row.marca_ejecutivo_3, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 4</div>, selector: row => row.telefono_4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X4</div>, selector: row => row.marca_x4, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X4</div>, selector: row => row.fecha_x4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 4</div>, selector: row => row.marca_ejecutivo_4, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 5</div>, selector: row => row.telefono_5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X5</div>, selector: row => row.marca_x5, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X5</div>, selector: row => row.fecha_x5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 5</div>, selector: row => row.marca_ejecutivo_5, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 6</div>, selector: row => row.telefono_6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X6</div>, selector: row => row.marca_x6, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X6</div>, selector: row => row.fecha_x6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 6</div>, selector: row => row.marca_ejecutivo_6, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 7</div>, selector: row => row.telefono_7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X7</div>, selector: row => row.marca_x7, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X7</div>, selector: row => row.fecha_x7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 7</div>, selector: row => row.marca_ejecutivo_7, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 8</div>, selector: row => row.telefono_8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X8</div>, selector: row => row.marca_x8, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X8</div>, selector: row => row.fecha_x8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 8</div>, selector: row => row.marca_ejecutivo_8, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 9</div>, selector: row => row.telefono_9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X9</div>, selector: row => row.marca_x9, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X9</div>, selector: row => row.fecha_x9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 9</div>, selector: row => row.marca_ejecutivo_9, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 10</div>, selector: row => row.telefono_10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X10</div>, selector: row => row.marca_x10, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X10</div>, selector: row => row.fecha_x10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 10</div>, selector: row => row.marca_ejecutivo_10, center: true, wrap: true },
        { name: <div className="text-wrap">BENEFICIO</div>, selector: row => row.beneficio, center: true, wrap: true },
        { name: <div className="text-wrap">ANTIGUEDAD</div>, selector: row => row.antiguedad, center: true, wrap: true },
        { name: <div className="text-wrap">CUOTA</div>, selector: row => row.cuota, center: true, wrap: true },
        { name: <div className="text-wrap">BENEFICIO VIGENCIA</div>, selector: row => row.fechainiciovigencia, center: true, wrap: true },
        { name: <div className="text-wrap">TIPO SEGURO</div>, selector: row => row.tiposeguro, center: true, wrap: true },
        { name: <div className="text-wrap">N SEGUROS</div>, selector: row => row.nseguros, center: true, wrap: true },

    ]);
    const [columsnEstacion, setColumnsEstacion] = useState([
        // { name: <div className="text-wrap">AO</div>, selector: row => row.ao, center: true, wrap: true },
        // { name: <div className="text-wrap">AO MES</div>, selector: row => row.ao_mes, center: true, wrap: true },
        // { name: <div className="text-wrap">MES</div>, selector: row => row.mes, center: true, wrap: true },
        // { name: <div className="text-wrap">HORA</div>, selector: row => row.hora, center: true, wrap: true },
        // { name: <div className="text-wrap">MINUTOS</div>, selector: row => row.minutos, center: true, wrap: true },
        // { name: <div className="text-wrap">AAAAMMDD</div>, selector: row => row.aaaammdd, center: true, wrap: true },
        { name: <div className="text-wrap">INDICE</div>, selector: row => row.indice, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE BASE</div>, selector: row => row.nombre_base, center: true, wrap: true },
        { name: <div className="text-wrap">RUT</div>, selector: row => row.rut, center: true, wrap: true },
        { name: <div className="text-wrap">DV</div>, selector: row => row.dv, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE PRIMERO</div>, selector: row => row.nombre_primero, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE SEGUNDO</div>, selector: row => row.nombre_segundo, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO PATERNO</div>, selector: row => row.apellido_paterno, center: true, wrap: true },
        { name: <div className="text-wrap">APELLIDO MATERNO</div>, selector: row => row.apellido_materno, center: true, wrap: true },
        { name: <div className="text-wrap">SUCURSAL</div>, selector: row => row.sucursal, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA NAC</div>, selector: row => row.fecha_nac, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA INGRESO CAJA</div>, selector: row => row.fechaingreso_caja, center: true, wrap: true },
        { name: <div className="text-wrap">EMAIL</div>, selector: row => row.email, center: true, wrap: true },
        { name: <div className="text-wrap">DIRECCION</div>, selector: row => row.direccion, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">NUMERO</div>, selector: row => row.numero, center: true, wrap: true },
        { name: <div className="text-wrap">VILLA</div>, selector: row => row.villa, center: true, wrap: true },
        { name: <div className="text-wrap">COMUNA</div>, selector: row => row.comuna, center: true, wrap: true },
        { name: <div className="text-wrap">CIUDAD</div>, selector: row => row.ciudad, center: true, wrap: true },
        { name: <div className="text-wrap">REGION</div>, selector: row => row.region, center: true, wrap: true },
        { name: <div className="text-wrap">NOMBRE EMPRESA EPP</div>, selector: row => row.nombre_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">RUT EMPRESA EPP</div>, selector: row => row.rut_empresa_epp, center: true, wrap: true },
        { name: <div className="text-wrap">CAMPANA</div>, selector: row => row.campana, center: true, wrap: false, width: '450px', },
        { name: <div className="text-wrap">PREAPROBADO</div>, selector: row => row.preaprobado, center: true, wrap: true },
        { name: <div className="text-wrap">VALOR CUOTA</div>, selector: row => row.valor_cuota, center: true, wrap: true },
        { name: <div className="text-wrap">PLAZO</div>, selector: row => row.plazo, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO LIQUIDO</div>, selector: row => row.monto_liquido, center: true, wrap: true },
        { name: <div className="text-wrap">CAE</div>, selector: row => row.cae, center: true, wrap: true },
        { name: <div className="text-wrap">TASA</div>, selector: row => row.tasa, center: true, wrap: true },
        { name: <div className="text-wrap">MONTO FINAL</div>, selector: row => row.monto_final, center: true, wrap: true },
        { name: <div className="text-wrap">FONO CONTACTO</div>, selector: row => row.fono_contacto, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA</div>, selector: row => row.fecha, center: true, wrap: true },
        { name: <div className="text-wrap">AGENTE</div>, selector: row => row.agente, center: true, wrap: true },
        { name: <div className="text-wrap">OBSERVACION</div>, selector: row => row.observacion, center: true, wrap: true },
        { name: <div className="text-wrap">DURATION</div>, selector: row => row.duration, center: true, wrap: true },
        { name: <div className="text-wrap">GRABACION</div>, selector: row => row.grabacion, center: true, wrap: false, width: '650px', },
        { name: <div className="text-wrap">CATEGORIA</div>, selector: row => row.categoria, center: true, wrap: true },
        { name: <div className="text-wrap">RESOLUCION</div>, selector: row => row.resolucion, center: true, wrap: true },
        { name: <div className="text-wrap">SUBCATEGORIA</div>, selector: row => row.subcategoria, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 1</div>, selector: row => row.telefono_1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X1</div>, selector: row => row.marca_x1, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X1</div>, selector: row => row.fecha_x1, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 1</div>, selector: row => row.marca_ejecutivo_1, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 2</div>, selector: row => row.telefono_2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X2</div>, selector: row => row.marca_x2, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X2</div>, selector: row => row.fecha_x2, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 2</div>, selector: row => row.marca_ejecutivo_2, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 3</div>, selector: row => row.telefono_3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X3</div>, selector: row => row.marca_x3, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X3</div>, selector: row => row.fecha_x3, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 3</div>, selector: row => row.marca_ejecutivo_3, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 4</div>, selector: row => row.telefono_4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X4</div>, selector: row => row.marca_x4, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X4</div>, selector: row => row.fecha_x4, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 4</div>, selector: row => row.marca_ejecutivo_4, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 5</div>, selector: row => row.telefono_5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X5</div>, selector: row => row.marca_x5, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X5</div>, selector: row => row.fecha_x5, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 5</div>, selector: row => row.marca_ejecutivo_5, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 6</div>, selector: row => row.telefono_6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X6</div>, selector: row => row.marca_x6, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X6</div>, selector: row => row.fecha_x6, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 6</div>, selector: row => row.marca_ejecutivo_6, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 7</div>, selector: row => row.telefono_7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X7</div>, selector: row => row.marca_x7, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X7</div>, selector: row => row.fecha_x7, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 7</div>, selector: row => row.marca_ejecutivo_7, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 8</div>, selector: row => row.telefono_8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X8</div>, selector: row => row.marca_x8, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X8</div>, selector: row => row.fecha_x8, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 8</div>, selector: row => row.marca_ejecutivo_8, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 9</div>, selector: row => row.telefono_9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X9</div>, selector: row => row.marca_x9, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X9</div>, selector: row => row.fecha_x9, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 9</div>, selector: row => row.marca_ejecutivo_9, center: true, wrap: true },
        { name: <div className="text-wrap">TELEFONO 10</div>, selector: row => row.telefono_10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA X10</div>, selector: row => row.marca_x10, center: true, wrap: true },
        { name: <div className="text-wrap">FECHA X10</div>, selector: row => row.fecha_x10, center: true, wrap: true },
        { name: <div className="text-wrap">MARCA EJECUTIVO 10</div>, selector: row => row.marca_ejecutivo_10, center: true, wrap: true },
        { name: <div className="text-wrap">RLA 2</div>, selector: row => row.rla2, center: true, wrap: true },
        { name: <div className="text-wrap">DOCUMENTO 1</div>, selector: row => row.documento1, center: true, wrap: true },
        { name: <div className="text-wrap">DOCUMENTO 2</div>, selector: row => row.documento2, center: true, wrap: true },
        { name: <div className="text-wrap">DOCUMENTO 3</div>, selector: row => row.documento3, center: true, wrap: true },
        { name: <div className="text-wrap">DOCUMENTO 4</div>, selector: row => row.documento4, center: true, wrap: true }

    ]);

    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const [dinamiccolumn, setDinamicColumn] = useState([])

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



    const handleOnExportCarga = () => {

        //creates a new workbook
        let wb = XLSX.utils.book_new();



        var arr2 = ''

        if (campanas === 'bUd__DMK') {
            arr2 = datafull.map(v => ({
                INDICE: v.indice,
                NOMBRE_BASE: v.nombre_base,
                RUT: v.rut,
                DV: v.dv,
                NOMBRE_PRIMERO: v.nombre_primero,
                NOMBRE_SEGUNDO: v.nombre_segundo,
                APELLIDO_PATERNO: v.apellido_paterno,
                APELLIDO_MATERNO: v.apellido_materno,
                SUCURSAL: v.sucursal,
                FECHA_NAC: v.fecha_nac,
                FECHA_INGRESO_CAJA: v.fechaingreso_caja,
                EMAIL: v.email,
                DIRECCION: v.direccion,
                NUMERO: v.numero,
                VILLA: v.villa,
                COMUNA: v.comuna,
                CIUDAD: v.ciudad,
                REGION: v.region,
                NOMBRE_EMPRESA_EPP: v.nombre_empresa_epp,
                RUT_EMPRESA_EPP: v.rut_empresa_epp,
                CAMPANA: v.campana,
                PREAPROBADO: v.preaprobado,
                VALOR_CUOTA: v.valor_cuota,
                PLAZO: v.plazo,
                MONTO_LIQUIDO: v.monto_liquido,
                CAE: v.cae,
                TASA: v.tasa,
                MONTO_FINAL: v.monto_final,
                FONO_CONTACTO: v.fono_contacto,
                FECHA: v.fecha,
                AGENTE: v.agente,
                OBSERVACION: v.observacion,
                DURATION: v.duration,
                GRABACION: v.grabacion,
                CATEGORIA: v.categoria,
                RESOLUCION: v.resolucion,
                SUBCATEGORIA: v.subcategoria,
                TELEFONO_1: v.telefono_1,
                MARCA_X1: v.marca_x1,
                FECHA_X1: v.fecha_x1,
                MARCA_EJECUTIVO_1: v.marca_ejecutivo_1,
                TELEFONO_2: v.telefono_2,
                MARCA_X2: v.marca_x2,
                FECHA_X2: v.fecha_x2,
                MARCA_EJECUTIVO_2: v.marca_ejecutivo_2,
                TELEFONO_3: v.telefono_3,
                MARCA_X3: v.marca_x3,
                FECHA_X3: v.fecha_x3,
                MARCA_EJECUTIVO_3: v.marca_ejecutivo_3,
                TELEFONO_4: v.telefono_4,
                MARCA_X4: v.marca_x4,
                FECHA_X4: v.fecha_x4,
                MARCA_EJECUTIVO_4: v.marca_ejecutivo_4,
                TELEFONO_5: v.telefono_5,
                MARCA_X5: v.marca_x5,
                FECHA_X5: v.fecha_x5,
                MARCA_EJECUTIVO_5: v.marca_ejecutivo_5,
                TELEFONO_6: v.telefono_6,
                MARCA_X6: v.marca_x6,
                FECHA_X6: v.fecha_x6,
                MARCA_EJECUTIVO_6: v.marca_ejecutivo_6,
                TELEFONO_7: v.telefono_7,
                MARCA_X7: v.marca_x7,
                FECHA_X7: v.fecha_x7,
                MARCA_EJECUTIVO_7: v.marca_ejecutivo_7,
                TELEFONO_8: v.telefono_8,
                MARCA_X8: v.marca_x8,
                FECHA_X8: v.fecha_x8,
                MARCA_EJECUTIVO_8: v.marca_ejecutivo_8,
                TELEFONO_9: v.telefono_9,
                MARCA_X9: v.marca_x9,
                FECHA_X9: v.fecha_x9,
                MARCA_EJECUTIVO_9: v.marca_ejecutivo_9,
                TELEFONO_10: v.telefono_10,
                MARCA_X10: v.marca_x10,
                FECHA_X10: v.fecha_x10,
                MARCA_EJECUTIVO_10: v.marca_ejecutivo_10,
                PREG_01: v.preg01,
                PREG_02: v.preg02,
                PREG_03: v.preg03,
                PREG_04: v.preg04,
                PREG_05: v.preg05,
                PREG_06: v.preg06,
                PREG_07: v.preg07,
                PREG_08: v.preg08,
                OBSERVACION_ENCUESTA: v.observacionencuesta,
            }));
        }
        else if (campanas === 'bUd7KCwK') {
            arr2 = datafull.map(v => ({
                INDICE: v.indice,
                NOMBRE_BASE: v.nombre_base,
                RUT: v.rut,
                DV: v.dv,
                NOMBRE_PRIMERO: v.nombre_primero,
                NOMBRE_SEGUNDO: v.nombre_segundo,
                APELLIDO_PATERNO: v.apellido_paterno,
                APELLIDO_MATERNO: v.apellido_materno,
                SUCURSAL: v.sucursal,
                FECHA_NAC: v.fecha_nac,
                FECHA_INGRESO_CAJA: v.fechaingreso_caja,
                EMAIL: v.email,
                DIRECCION: v.direccion,
                NUMERO: v.numero,
                VILLA: v.villa,
                COMUNA: v.comuna,
                CIUDAD: v.ciudad,
                REGION: v.region,
                NOMBRE_EMPRESA_EPP: v.nombre_empresa_epp,
                RUT_EMPRESA_EPP: v.rut_empresa_epp,
                CAMPANA: v.campana,
                PREAPROBADO: v.preaprobado,
                VALOR_CUOTA: v.valor_cuota,
                PLAZO: v.plazo,
                MONTO_LIQUIDO: v.monto_liquido,
                CAE: v.cae,
                TASA: v.tasa,
                MONTO_FINAL: v.monto_final,
                FONO_CONTACTO: v.fono_contacto,
                FECHA: v.fecha,
                AGENTE: v.agente,
                OBSERVACION: v.observacion,
                DURATION: v.duration,
                GRABACION: v.grabacion,
                CATEGORIA: v.categoria,
                RESOLUCION: v.resolucion,
                SUBCATEGORIA: v.subcategoria,
                TELEFONO_1: v.telefono_1,
                MARCA_X1: v.marca_x1,
                FECHA_X1: v.fecha_x1,
                MARCA_EJECUTIVO_1: v.marca_ejecutivo_1,
                TELEFONO_2: v.telefono_2,
                MARCA_X2: v.marca_x2,
                FECHA_X2: v.fecha_x2,
                MARCA_EJECUTIVO_2: v.marca_ejecutivo_2,
                TELEFONO_3: v.telefono_3,
                MARCA_X3: v.marca_x3,
                FECHA_X3: v.fecha_x3,
                MARCA_EJECUTIVO_3: v.marca_ejecutivo_3,
                TELEFONO_4: v.telefono_4,
                MARCA_X4: v.marca_x4,
                FECHA_X4: v.fecha_x4,
                MARCA_EJECUTIVO_4: v.marca_ejecutivo_4,
                TELEFONO_5: v.telefono_5,
                MARCA_X5: v.marca_x5,
                FECHA_X5: v.fecha_x5,
                MARCA_EJECUTIVO_5: v.marca_ejecutivo_5,
                TELEFONO_6: v.telefono_6,
                MARCA_X6: v.marca_x6,
                FECHA_X6: v.fecha_x6,
                MARCA_EJECUTIVO_6: v.marca_ejecutivo_6,
                TELEFONO_7: v.telefono_7,
                MARCA_X7: v.marca_x7,
                FECHA_X7: v.fecha_x7,
                MARCA_EJECUTIVO_7: v.marca_ejecutivo_7,
                TELEFONO_8: v.telefono_8,
                MARCA_X8: v.marca_x8,
                FECHA_X8: v.fecha_x8,
                MARCA_EJECUTIVO_8: v.marca_ejecutivo_8,
                TELEFONO_9: v.telefono_9,
                MARCA_X9: v.marca_x9,
                FECHA_X9: v.fecha_x9,
                MARCA_EJECUTIVO_9: v.marca_ejecutivo_9,
                TELEFONO_10: v.telefono_10,
                MARCA_X10: v.marca_x10,
                FECHA_X10: v.fecha_x10,
                MARCA_EJECUTIVO_10: v.marca_ejecutivo_10,
                BENEFICIO: v.beneficio,
                ANTIGUEDAD: v.antiguedad,
                CUOTA: v.cuota,
                BENEFICIO_VIGENCIA: v.fechainiciovigencia,
                TIPO_SEGURO: v.tiposeguro,
                N_SEGUROS: v.nseguros
            }));
        }
        else if (campanas === 'baw9mRMK') {
            setColumns(columsnEstacion)
        }
        else {
            arr2 = datafull.map(v => ({
                INDICE: v.indice,
                NOMBRE_BASE: v.nombre_base,
                RUT: v.rut,
                DV: v.dv,
                NOMBRE_PRIMERO: v.nombre_primero,
                NOMBRE_SEGUNDO: v.nombre_segundo,
                APELLIDO_PATERNO: v.apellido_paterno,
                APELLIDO_MATERNO: v.apellido_materno,
                SUCURSAL: v.sucursal,
                FECHA_NAC: v.fecha_nac,
                FECHA_INGRESO_CAJA: v.fechaingreso_caja,
                EMAIL: v.email,
                DIRECCION: v.direccion,
                NUMERO: v.numero,
                VILLA: v.villa,
                COMUNA: v.comuna,
                CIUDAD: v.ciudad,
                REGION: v.region,
                NOMBRE_EMPRESA_EPP: v.nombre_empresa_epp,
                RUT_EMPRESA_EPP: v.rut_empresa_epp,
                CAMPANA: v.campana,
                PREAPROBADO: v.preaprobado,
                VALOR_CUOTA: v.valor_cuota,
                PLAZO: v.plazo,
                MONTO_LIQUIDO: v.monto_liquido,
                CAE: v.cae,
                TASA: v.tasa,
                MONTO_FINAL: v.monto_final,
                FONO_CONTACTO: v.fono_contacto,
                FECHA: v.fecha,
                AGENTE: v.agente,
                OBSERVACION: v.observacion,
                DURATION: v.duration,
                GRABACION: v.grabacion,
                CATEGORIA: v.categoria,
                RESOLUCION: v.resolucion,
                SUBCATEGORIA: v.subcategoria,
                TELEFONO_1: v.telefono_1,
                MARCA_X1: v.marca_x1,
                FECHA_X1: v.fecha_x1,
                MARCA_EJECUTIVO_1: v.marca_ejecutivo_1,
                TELEFONO_2: v.telefono_2,
                MARCA_X2: v.marca_x2,
                FECHA_X2: v.fecha_x2,
                MARCA_EJECUTIVO_2: v.marca_ejecutivo_2,
                TELEFONO_3: v.telefono_3,
                MARCA_X3: v.marca_x3,
                FECHA_X3: v.fecha_x3,
                MARCA_EJECUTIVO_3: v.marca_ejecutivo_3,
                TELEFONO_4: v.telefono_4,
                MARCA_X4: v.marca_x4,
                FECHA_X4: v.fecha_x4,
                MARCA_EJECUTIVO_4: v.marca_ejecutivo_4,
                TELEFONO_5: v.telefono_5,
                MARCA_X5: v.marca_x5,
                FECHA_X5: v.fecha_x5,
                MARCA_EJECUTIVO_5: v.marca_ejecutivo_5,
                TELEFONO_6: v.telefono_6,
                MARCA_X6: v.marca_x6,
                FECHA_X6: v.fecha_x6,
                MARCA_EJECUTIVO_6: v.marca_ejecutivo_6,
                TELEFONO_7: v.telefono_7,
                MARCA_X7: v.marca_x7,
                FECHA_X7: v.fecha_x7,
                MARCA_EJECUTIVO_7: v.marca_ejecutivo_7,
                TELEFONO_8: v.telefono_8,
                MARCA_X8: v.marca_x8,
                FECHA_X8: v.fecha_x8,
                MARCA_EJECUTIVO_8: v.marca_ejecutivo_8,
                TELEFONO_9: v.telefono_9,
                MARCA_X9: v.marca_x9,
                FECHA_X9: v.fecha_x9,
                MARCA_EJECUTIVO_9: v.marca_ejecutivo_9,
                TELEFONO_10: v.telefono_10,
                MARCA_X10: v.marca_x10,
                FECHA_X10: v.fecha_x10,
                MARCA_EJECUTIVO_10: v.marca_ejecutivo_10
            }));
        }

        var arr3 = datafullresult.map(v => ({
            Detalle: v.detalle,
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
        }));



        let ws = XLSX.utils.json_to_sheet(arr2);
        let ws_2 = XLSX.utils.json_to_sheet(arr3);
        var today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        XLSX.utils.book_append_sheet(wb, ws_2, "Resumen");
        XLSX.utils.book_append_sheet(wb, ws, "Detalle");

        XLSX.writeFile(wb, "Reporte_Resultante_" + date + ".xlsx");
    };

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)




    // useEffect(() => {
    //     setLoading1(true)
    //     setLoading2(true)
    //     setLoading3(true)
    //     setTimeout(() => {
    //         setLoading1(false)
    //         setLoading2(false)
    //         setLoading3(false)
    //     }, 4000)
    // }, [])


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
                setAuthLoading(true);


            }).catch(error => {
                removeUserSession();
                setAuthLoading(true);
            });

        DatosResumenDash()
        DatosResumen()
        Datos()



    }, []);

    const DatosResumen = (async () => {

        setLoading1(true)
        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Resultante/Campana/Resumen',
            { dato: campanas, dato_1: cargas },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)
            setDataResult(result.data);
            setLoading1(false)
        }
        else{
            setLoading1(false)

        }

    })
    const DatosResumenDash = (async () => {

        setLoading2(true)
        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Resultante/Campana/Resumen/Dash',
            { dato: campanas, dato_1: cargas },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)
            setDataResultDash(result.data);

            setLoading2(false)
        }
        else{
            setLoading2(false)

        }

    })

    const showResumenDash = () => {

        return datafullresultdash.map((data, index) => {
            return (
                <div className="row animate__animated animate__slideInLeft">
                    <div className="col-12">
                        <div className="row row-cols-1 row-cols-md-2 mb-2 text-center">
                            <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> Cargados </h4>
                                    </div>
                                    <div className="card-body">
                                        <h5> {data.cargados}</h5>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> Recorridos </h4>
                                    </div>
                                    <div className="card-body">
                                        <h5>{data.recorrido}</h5>

                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> No Recorridos </h4>
                                    </div>
                                    <div className="card-body">
                                        <h5> {data.sinrecorrer}</h5>

                                    </div>
                                </div>
                            </div> */}
                            <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> Contactados </h4>
                                    </div>
                                    <div className="card-body">

                                        <h5>{data.contactados}</h5>

                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> Efectivos </h4>
                                    </div>
                                    <div className="card-body">

                                        <h5> {data.contacto_efectivo}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-2">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal"> No Contactados </h4>
                                    </div>
                                    <div className="card-body">

                                        <h5>{data.nocontactados}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            );
        });
    }

    const Datos = (async () => {

        setLoading3(true)
        const result = await axios.post('https://app.soluziona.cl/API_v1_prod/CallSouth/API_CallSouth_CRM_LosHeroes/api/Ventas_CRM/CRM/Resultante/Campana',
            { dato: campanas, dato_1: cargas },
            { headers: { "Authorization": `Bearer ${sesiones.stoken}` } })

        if (result.status === 200) {

            // console.log(result.data)
            setData(result.data);


            if (campanas === 'bUd__DMK') {
                setColumns(columsnFaseA)
            }
            else if (campanas === 'bUd7KCwK') {
                setColumns(columsnReforzamiento)
            }
            else if (campanas === 'baw9mRMK') {
                setColumns(columsnEstacion)
            }
            else {

                setColumns(columsnNormal)
            }


            setLoading3(false)
        }
        else{
            setLoading3(false)

        }

    })

    const customStyles2 = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '50px',

                border: '2px solid #a9dff0',
                borderRadius: '3px'
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#a9dff0',
                width: '150px'
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize: '12px',


            },
        },
    };

    const customStyles = {
        rows: {
            style: {
                minHeight: '30px', // override the row height
                maxHeight: '50px',

                border: '2px solid #a9dff0',
                borderRadius: '3px'
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                backgroundColor: '#a9dff0',
                width: '250px'
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize: '12px',


            },
        },
    };

    const columnsresult = [
        { name: <div className="text-wrap">Detalle</div>, selector: row => row.detalle.replace('_', ' '), wrap: true, left: true },
        // {
        //     name: <div className="text-wrap">Total</div>,
        //     selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row.total)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row.total)) : row.total
        //     , wrap: true, center: true
        // },
        { name: <div className="text-wrap">01</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._1)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._1)) : row._1, center: true },
        { name: <div className="text-wrap">02</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._2)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._2)) : row._2, center: true },
        { name: <div className="text-wrap">03</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._3)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._3)) : row._3, center: true },
        { name: <div className="text-wrap">04</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._4)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._4)) : row._4, center: true },
        { name: <div className="text-wrap">05</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._5)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._5)) : row._5, center: true },
        { name: <div className="text-wrap">06</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._6)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._6)) : row._6, center: true },
        { name: <div className="text-wrap">07</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._7)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._7)) : row._7, center: true },
        { name: <div className="text-wrap">08</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._8)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._8)) : row._8, center: true },
        { name: <div className="text-wrap">09</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._9)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._9)) : row._9, center: true },
        { name: <div className="text-wrap">10</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._10)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._10)) : row._10, center: true },
        { name: <div className="text-wrap">11</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._11)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._11)) : row._11, center: true },
        { name: <div className="text-wrap">12</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._12)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._12)) : row._12, center: true },
        { name: <div className="text-wrap">13</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._13)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._13)) : row._13, center: true },
        { name: <div className="text-wrap">14</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._14)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._14)) : row._14, center: true },
        { name: <div className="text-wrap">15</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._15)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._15)) : row._15, center: true },
        { name: <div className="text-wrap">16</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._16)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._16)) : row._16, center: true },
        { name: <div className="text-wrap">17</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._17)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._17)) : row._17, center: true },
        { name: <div className="text-wrap">18</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._18)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._18)) : row._18, center: true },
        { name: <div className="text-wrap">19</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._19)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._19)) : row._19, center: true },
        { name: <div className="text-wrap">20</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._20)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._20)) : row._20, center: true },
        { name: <div className="text-wrap">21</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._21)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._21)) : row._21, center: true },
        { name: <div className="text-wrap">22</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._22)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._22)) : row._22, center: true },
        { name: <div className="text-wrap">23</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._23)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._23)) : row._23, center: true },
        { name: <div className="text-wrap">24</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._24)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._24)) : row._24, center: true },
        { name: <div className="text-wrap">25</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._25)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._25)) : row._25, center: true },
        { name: <div className="text-wrap">26</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._26)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._26)) : row._26, center: true },
        { name: <div className="text-wrap">27</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._27)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._27)) : row._27, center: true },
        { name: <div className="text-wrap">28</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._28)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._28)) : row._28, center: true },
        { name: <div className="text-wrap">29</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._29)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._29)) : row._29, center: true },
        { name: <div className="text-wrap">30</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._30)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._30)) : row._30, center: true },
        { name: <div className="text-wrap">31</div>, selector: row => (row.detalle === 'tiempo_llamada' || row.detalle === 'tmo_oper' || row.detalle === 'tmo_prom' || row.detalle === 'tiempo_hold') ? (secondsToString(parseInt(row._31)) === 'NaN:NaN:NaN') ? '' : secondsToString(parseInt(row._31)) : row._31, center: true },

    ];



    return (
        <>

            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resultante Dashboard</h4>
                            </div>
                            <div className="card-body">
                                {loading1 ? (
                                    <div className="d-flex justify-content-center mt-3">
                                        <DotLoader
                                            className='loading'
                                            color={'#5b198ab5'}
                                            loading={loading1}
                                            size={60}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>

                                ) : (

                                    showResumenDash()


                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resultante Resumen</h4>
                            </div>
                            <div className="card-body">
                                <section className=" float-start">
                                    <button
                                        onClick={handleOnExportCarga}
                                        className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                        <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                    </button>
                                </section>
                                {loading2 ? (
                                    <div className="d-flex justify-content-center mt-3">
                                        <DotLoader
                                            className='loading'
                                            color={'#5b198ab5'}
                                            loading={loading2}
                                            size={60}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>

                                ) : (
                                    <div className=" mt-5 "  >

                                        <DataTable
                                            columns={columnsresult}
                                            data={datafullresult}
                                            customStyles={customStyles2}
                                            noDataComponent="Los Filtros No Contiene Datos" //or your component
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="row">
                <div className="col-12">

                    <div className="col-sm-12 col-md-12 col-lg-12 text-center">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Resultante Detalle</h4>
                            </div>
                            <div className="card-body">
                                {/* <section className=" float-start">
                                    <button
                                        onClick={handleOnExportCarga}
                                        className="rounded inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-secondary rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 m-2 text-white">
                                        <i className="fa-solid fa-file-excel mr-2"></i>  Exportar
                                    </button>
                                </section> */}
                                {loading3 ? (
                                    <div className="d-flex justify-content-center mt-3">
                                        <DotLoader
                                            className='loading'
                                            color={'#5b198ab5'}
                                            loading={loading3}
                                            size={60}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>

                                ) : (
                                    <div className=" mt-5 "  >

                                        <DataTable
                                            columns={columns}
                                            data={datafull}
                                            customStyles={customStyles}
                                            pagination
                                            noDataComponent="Los Filtros No Contiene Datos" //or your component
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
export default ReporteResultanteCampanaTabla