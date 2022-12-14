import React from 'react'
import '../styles/TableStyle.css';
import numeral from "numeral";


const Table = ({ countries }) => {
    return (
        <div className="table">
            {countries.map(country => (
                <tr>
                    <td>{country.country}</td>
                    <td>
                        <strong>
                            {numeral(country.cases).format('0,0a')}
                        </strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
