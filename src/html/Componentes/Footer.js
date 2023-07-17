import React from "react"

function Footer() {
    return (
        <>
            <footer className="d-flex absolute-bottom  justify-content-between align-items-center py-3 my-4 m-3 " id="footer">
                <div className="col-md-4 d-flex align-items-center">
                    <span className=" ">Copyright © 2021 Soluziona All rights reserved</span>
                </div>
                <div className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <span className=""><i className="fa-solid fa-envelope"></i> soporte@soluziona.cl</span>
                </div>
            </footer>
        </>
    )
}
export default Footer