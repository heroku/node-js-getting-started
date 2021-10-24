import React from 'react'
import { Link } from "react-router-dom";

export default function Chat() {
    return (
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: "99vw"}}>

        <div className="list-group list-group-flush border-bottom scrollarea">
          <Link to="#" className="list-group-item list-group-item-action active py-3 lh-tight" aria-current="true">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Dhaval</strong>
              <small>Wed</small>
            </div>
            <div className="col-10 mb-1 small">Hello!</div>
          </Link>
          <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Rohit</strong>
              <small className="text-muted">Tues</small>
            </div>
            <div className="col-10 mb-1 small">Will be in an hour</div>
          </Link>
          <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Vipul</strong>
              <small className="text-muted">Mon</small>
            </div>
            <div className="col-10 mb-1 small">How are you?</div>
          </Link>
    
          <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight" aria-current="true">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Tina</strong>
              <small className="text-muted">Wed</small>
            </div>
            <div className="col-10 mb-1 small">Sorry</div>
          </Link>
          <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Ketan</strong>
              <small className="text-muted">Tues</small>
            </div>
            <div className="col-10 mb-1 small">....</div>
          </Link>
          <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">Sunny</strong>
              <small className="text-muted">Mon</small>
            </div>
            <div className="col-10 mb-1 small">Where are you?</div>
          </Link>
        </div>
      </div>
    
    )
}
