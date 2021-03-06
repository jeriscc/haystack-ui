/*
 * Copyright 2018 Expedia Group
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

const Q = require('q');

function getRandomTimeStamp() {
    const currentTime = ((new Date()).getTime()) * 1000;
    return (currentTime - Math.floor((Math.random() * 5000 * 60 * 1000)));
}

function getAlertHistoryTimestamps() {
    const currentTime = ((new Date()).getTime()) * 1000;
    const end = (currentTime - Math.floor((Math.random() * 2000000 * 60 * 1000)));
    const start = end - Math.floor((Math.random() * 5000 * 60 * 1000));
    return {
        startTimestamp: start,
        endTimestamp: end
    };
}

function getAlerts() {
    return [
        {
            operationName: 'tarley-1',
            type: 'count',
            isUnhealthy: true,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'tarley-1',
            type: 'durationTP99',
            isUnhealthy: true,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'tarley-1',
            type: 'failureCount',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'tully-1',
            type: 'count',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'tully-1',
            type: 'durationTP99',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'tully-1',
            type: 'failureCount',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'dondarrion-1',
            type: 'count',
            isUnhealthy: true,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'dondarrion-1',
            type: 'durationTP99',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'dondarrion-1',
            type: 'failureCount',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        },
        {
            operationName: 'dondarrion-1',
            type: 'AADuration',
            isUnhealthy: false,
            timestamp: getRandomTimeStamp()
        }
    ];
}

const alertDetails = [
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps()
];

const connector = {};

connector.getServiceAlerts = (service, query) => Q.fcall(() => getAlerts(query));

connector.getAlertHistory = () => Q.fcall(() => alertDetails);

connector.getServiceUnhealthyAlertCount = () => Q.fcall(() => Math.floor(Math.random() * 3));

module.exports = connector;
