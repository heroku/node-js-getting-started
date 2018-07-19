import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap';
import './SideBar.css'


const SideBar = () => (
    <div>
        <h2>Lambda Notes</h2>

            <Link to='/notes'>
            <button className={"button"} pathto='/notes' >
                    View Your Notes
                </button>
            </Link>
            <Link to='/new'>
            <button className={"button"}>
                    + Create New Note
                </button>
            </Link>
    </div>
)

export default SideBar
