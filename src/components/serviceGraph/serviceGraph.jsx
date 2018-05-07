/*
 * Copyright 2018 Expedia, Inc.
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

import serviceGraphStore from './stores/serviceGraphStore';
import ServiceGraphContainer from './serviceGraphContainer';
import './serviceGraph.less';

const ServiceGraph = props => (
    <section className="service-graph-panel">
        <ServiceGraphContainer store={serviceGraphStore} history={props.history}/>
    </section>
);

ServiceGraph.propTypes = {
    history: PropTypes.object.isRequired
};

export default ServiceGraph;