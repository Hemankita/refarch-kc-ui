/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const express = require('express');
import FleetClient from './FleetClient';
import * as domain from './fleetDomain';

const fleetClient = new FleetClient();

/** Export the APIs for the front end */
module.exports = function(app:any) {
    // health verb for application monitoring.
    app.get('/healthz',(req:any,res:any) => {
      res.send('UP and running');
    });

    app.get('/api/fleets', (req:any,res:any) => {
        console.log("In api GET fleets");
        let fleets = [{id: "f1", name: "KC-NorthAtlantic"}, {id: "f2", name: "KC-NorthPacific"},{id: "f2", name: "KC-SouthPacific"}];
        fleetClient.getFleetNames().then((fleets: domain.Fleet[])=> {
            console.log("Got this " + JSON.stringify(fleets));
            res.status(200).send(fleets);
        });
        
    });

    app.get('/api/fleets/:fleetname', (req,res) => {
        console.log("In api GET fleet ships for " + req.params.fleetname);       
        fleetClient.getFleetByName(req.params.fleetname).then( (aFleet: domain.Fleet) => {
            console.log("Got this " + JSON.stringify(aFleet));
            res.status(200).send(aFleet);
        });
    });



    app.post('/api/fleets/simulate', (req,res) => {
        console.log("In api POST fleets simulate " + JSON.stringify(req.body));
        if (req.body !== undefined) {
            fleetClient.fleetSimulation(req.body).then((data: domain.SimulResponse) => {
                res.status(200).send(data);
            });
        }
    });


    app.post('/api/ships/simulate', (req,res) => {
        console.log("In api POST ship simulate " + req);
        if (req.body !== undefined) {
            fleetClient.shipSimulation(req.body).then((data: domain.Ship) => {
                res.status(200).send(data);
            });
        } 
    });
} // end exports