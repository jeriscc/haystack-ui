/*
 * Copyright 2018 Expedia Group
 *
 *       Licensed under the Apache License, Version 2.0 (the "License");
 *       you may not use this file except in compliance with the License.
 *       You may obtain a copy of the License at
 *
 *           http://www.apache.org/licenses/LICENSE-2.0
 *
 *       Unless required by applicable law or agreed to in writing, software
 *       distributed under the License is distributed on an "AS IS" BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *       See the License for the specific language governing permissions and
 *       limitations under the License.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import _ from 'lodash';


const NodeDetails = ({serviceName, requestRate, errorPercent, incomingEdges, outgoingEdges, tags}) => {
    const titleLinkStr = `/usb?serviceName=${serviceName}`;
    const incomingEdgeStr = _.reduce(_.slice(incomingEdges, 1), (result, val) => `${result}  ${val}`, incomingEdges[0]);
    const outgoingEdgeStr = _.reduce(_.slice(outgoingEdges, 1), (result, val) => `${result}  ${val}`, outgoingEdges[0]);
    return (
         <div>
            <header className="clearfix">
                <h3 className="text-center service-graph__label-large">name: <strong><Link to={titleLinkStr}>{serviceName}</Link></strong></h3>
                <h4 className="text-center"><strong>Request Rate:</strong> {requestRate}/sec</h4>
                <h4 className="text-center"><strong>Error Rate:</strong> {errorPercent}/sec</h4>
                <p className="text-center service-graph__label-small"><strong>Incoming edges:</strong> {incomingEdgeStr}</p>
                <p className="text-center service-graph__label-small"><strong>Outgoing edges:</strong> {outgoingEdgeStr}</p>
                <p className="text-center service-graph__label-small"><strong>Tags:</strong> {JSON.stringify(tags)}</p>
            </header>
         </div>
    );
};

NodeDetails.defaultProps = {
    tags: {}
};

NodeDetails.propTypes =
    {
        serviceName: PropTypes.string.isRequired,
        requestRate: PropTypes.string.isRequired,
        errorPercent: PropTypes.string.isRequired,
        incomingEdges: PropTypes.array.isRequired,
        outgoingEdges: PropTypes.array.isRequired,
        tags: PropTypes.object

    };
export default NodeDetails;

