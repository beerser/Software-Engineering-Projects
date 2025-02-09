import React from 'react';
import "./QR.css";

const QR = ({ item }) => {
    return (
        <div>
            <div className='textx'>
                <div className="payment-header">
                    <p className='Herd'>Payment Methods</p>
                    <div className='bt'>
                        <ul className="nav justify-content-end">
                            <li className="nav-item1">
                                <a className="nav-link active" style={{ color: "black" }} aria-current="page">Cash</a>
                            </li>
                            <li className="nav-item2">
                                <a className="nav-link">Change</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />

                <div className='lo'><p className='pp'>Price</p><p className='priceC'>{item.price}</p></div>
                <hr />
                <div className="terms-container">
                    <p className='term'>
                        Residents must complete the necessary procedures at the registered address 2-3 days before the due date.
                        If the deadline is exceeded, the reservation will be canceled, and it will be in accordance with the
                        <span className='Bu'>terms of service,</span>
                        <span className='Bu'>terms</span> of use, and  <span className='Bu'> privacy policy</span>
                    </p>

                    <button className='confirm-buttonn'>Confirm</button>
                </div>

            </div>
        </div>
    );
};

export default QR;
