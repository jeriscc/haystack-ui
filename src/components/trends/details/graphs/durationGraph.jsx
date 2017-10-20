/*
 * Copyright 2017 Expedia, Inc.
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */

import React from 'react';
import {Line} from 'react-chartjs-2';
import PropTypes from 'prop-types';

import options from './options';

const backgroundColor1 = [['rgba(255, 99, 132, 0.2)']];
const borderColor1 = [['rgba(255, 99, 132, 1)']];

const backgroundColor2 = [['rgba(255, 159, 64, 0.2)']];
const borderColor2 = [['rgba(255, 159, 64, 1)']];

const backgroundColor3 = [['rgba(255, 206, 86, 0.2)']];
const borderColor3 = [['rgba(255, 206, 86, 1)']];

const DurationGraph = ({meanPoints, tp95Points, tp99Points}) => {
    const meanData = meanPoints.map(point => ({x: new Date(point.timestamp), y: point.value}));
    const tp95Data = tp95Points.map(point => ({x: new Date(point.timestamp), y: point.value}));
    const tp99Data = tp99Points.map(point => ({x: new Date(point.timestamp), y: point.value}));

    const chartData = {
        datasets: [{
            label: 'Mean',
            data: meanData,
            backgroundColor: backgroundColor1,
            borderColor: borderColor1,
            borderWidth: 1
        },
        {
            label: 'TP95',
            data: tp95Data,
            backgroundColor: backgroundColor2,
            borderColor: borderColor2,
            borderWidth: 1
        },
        {
            label: 'TP99',
            data: tp99Data,
            backgroundColor: backgroundColor3,
            borderColor: borderColor3,
            borderWidth: 1
        }]
    };

    return (<div className="col-md-12">
            <h5 className="text-center">Duration</h5>
            <div className="chart-container">
                <Line data={chartData} options={options} type="line" />
            </div>
        </div>
    );
};

DurationGraph.propTypes = {
    meanPoints: PropTypes.object.isRequired,
    tp95Points: PropTypes.object.isRequired,
    tp99Points: PropTypes.object.isRequired
};

export default DurationGraph;
