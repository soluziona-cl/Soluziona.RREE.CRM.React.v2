import Header from './Componentes/Header';
import Sidebar from './Componentes/Sidebar';
import Footer from './Componentes/Footer';

import ImportarArchivo from './Componentes/ImportarArchivo';
import Company_Campaing_Colas from './Componentes/Company_Campaing_Colas';

function SubirArchivos() {
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
                        {/* <div className="page-header pt-3">
                            <h2>Subir Archivos</h2>
                        </div> */}
                        <hr />
                        <div className="row justify-space-center m-3 col-md-10">
                            {/* <div className="col-12">
                                <Company_Campaing />
                                <ImportarArchivo />
                            </div> */}
                            <div className="card mb-4 rounded-3 shadow-sm">
                                <div className="card-header">
                                    <h4 className="my-0 font-weight-normal">Subir Archivos</h4>
                                </div>
                                <div className="card-body">
                                    <Company_Campaing_Colas />
                                    <ImportarArchivo />
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
                <Footer />
            </div>

        </>
    )
}
export default SubirArchivos