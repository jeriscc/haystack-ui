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
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import Select from 'react-select';
import {observer} from 'mobx-react';

import './serviceTools.less';
import AlertCounter from '../alerts/alertCounter';
import serviceStore from '../../stores/serviceStore';
import ServiceToolsContainer from './serviceToolsContainer';
import loginRenewer from '../../utils/loginRenewer';

const subsystems = (window.haystackUiConfig && window.haystackUiConfig.subsystems) || [];

const isAlertsEnabled = subsystems.includes('alerts');
const isTrendsEnabled = subsystems.includes('trends');

@observer
export default class ServiceTools extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    };

    static convertToValueLabelMap(serviceList) {
        return serviceList
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map(service => ({value: service, label: service}));
    }

    constructor(props) {
        super(props);

        this.state = {
            serviceChangeToggleOpen: false
        };

        this.handleServiceChange = this.handleServiceChange.bind(this);
        this.showServiceChanger = this.showServiceChanger.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        serviceStore.fetchServices();
        if (window.haystackUiConfig.enableSSO) loginRenewer.init();
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleServiceChange(event) {
        const pathname = this.props.location.pathname;
        const activeView = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
        this.props.history.push(`/service/${encodeURIComponent(event.value)}/${activeView}`);
        this.setState({serviceChangeToggleOpen: false});
    }

    showServiceChanger() {
        document.addEventListener('mousedown', this.handleOutsideClick);
        this.setState({serviceChangeToggleOpen: true});
    }

    handleOutsideClick(e) {
        if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            document.removeEventListener('mousedown', this.handleOutsideClick);
            this.setState({serviceChangeToggleOpen: false});
        }
    }

    render() {
        const serviceName = this.props.match.params.serviceName;
        const navLinkClass = 'serviceToolsTab__tab-option col-xs-3';
        const navLinkClassActive = 'serviceToolsTab__tab-option col-xs-3 tab-active';
        const serviceChangeToggleOpen = this.state.serviceChangeToggleOpen;

        const Tabs = () => (<nav className="serviceToolsTab__tabs col-md-6">
            {isTrendsEnabled &&
                <NavLink
                    className={navLinkClass}
                    activeClassName={navLinkClassActive}
                    to={`/service/${serviceName}/trends`}
                >
                    <span className="serviceToolsTab__tab-option-icon ti-stats-up"/>
                    Trends
                </NavLink>
            }
            <NavLink
                className={navLinkClass}
                activeClassName={navLinkClassActive}
                to={`/service/${serviceName}/traces`}
            >
                <span className="serviceToolsTab__tab-option-icon ti-align-left"/>
                Traces
            </NavLink>
            {isAlertsEnabled &&
                <NavLink
                    className={navLinkClass}
                    activeClassName={navLinkClassActive}
                    to={`/service/${serviceName}/alerts`}
                >
                    <span className="serviceToolsTab__tab-option-icon ti-bell"/>
                    <span>Alerts</span>
                    <AlertCounter serviceName={this.props.match.params.serviceName} />
                </NavLink>
            }
        </nav>);

        const ServiceChange = () => ((
            <div ref={this.setWrapperRef} className="serviceChangeContainer">
                <Select
                    className="serviceChangeContainer__select"
                    options={ServiceTools.convertToValueLabelMap(serviceStore.services)}
                    onChange={this.handleServiceChange}
                    placeholder="Change Service..."
                    autofocus
                    openOnFocus
                />
            </div>
        ));

        const trimmedServiceName = serviceName.length > 25 ? `${serviceName.substring(0, 25)}...` : serviceName;

        return (<article className="serviceTools">
                <nav className="serviceToolsTab">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h3 className="serviceToolsTab__title" onClick={this.showServiceChanger}>
                                    {
                                        serviceChangeToggleOpen ?
                                            <ServiceChange/> :
                                            <span className="serviceToolsTab__title-name">{decodeURIComponent(trimmedServiceName)}</span>
                                    }
                                    <span
                                        className={serviceChangeToggleOpen ?
                                            'serviceToolsTab__title-toggle active ti-pencil' :
                                            'serviceToolsTab__title-toggle ti-pencil'}
                                    />
                                </h3>
                            </div>
                            <Tabs/>
                        </div>
                    </div>
                </nav>
                <ServiceToolsContainer serviceName={serviceName} location={this.props.location}/>
            </article>
        );
    }
}
