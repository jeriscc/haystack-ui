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
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { MemoryRouter } from 'react-router';

import Alerts from '../../../src/components/alerts/alerts';
import AlertsView from '../../../src/components/alerts/alertsView';
import AlertDetails from '../../../src/components/alerts/details/alertDetails';
import {ServiceAlertsStore} from '../../../src/components/alerts/stores/serviceAlertsStore';
import {AlertDetailsStore} from '../../../src/components/alerts/stores/alertDetailsStore';

const stubService = 'StubService';

const fulfilledPromise = {
    case: ({fulfilled}) => fulfilled()
};

const rejectedPromise = {
    case: ({rejected}) => rejected()
};

const pendingPromise = {
    case: ({pending}) => pending()
};
const stubMatch = {
    params: {
        serviceName: 'abc-service'
    }
};

const stubLocation = {
    search: ''
};

const stubDefaultPreset =
    {
        shortName: '6h',
        longName: '6 hours',
        value: 6 * 60 * 60 * 1000
    };

const stubSubscriptions = [
    {
        subscriptionId: 101,
        dispatcherType: 'slack',
        dispatcherIds: [
            '#stub-subscription-1'
        ]
    },
    {
        subscriptionId: 102,
        dispatcherType: 'smtp',
        dispatcherIds: [
            'stub-subscription@2.com'
        ]
    }
];

const stubAddedSubscription = [
    {
        subscriptionId: 101,
        dispatcherType: 'slack',
        dispatcherIds: [
            '#stub-subscription-1'
        ]
    },
    {
        subscriptionId: 102,
        dispatcherType: 'smtp',
        dispatcherIds: [
            'stub-subscription@2.com'
        ]
    },
    {
        subscriptionId: 101,
        dispatcherType: 'slack',
        dispatcherIds: [
            '#added-subscription-1'
        ]
    }
];

function getValue(min, max) {
    return _.round((Math.random() * (max - min)) + min, 0);
}

function getRandomTimeStamp() {
    const currentTime = ((new Date()).getTime()) * 1000;
    return (currentTime - Math.floor((Math.random() * 5000 * 60 * 1000)));
}

function getRandomValues() {
    const valuesArr = [];
    _.range(50).forEach(() => valuesArr.push({value: getValue(1000, 10000000), timestamp: getRandomTimeStamp()}));
    return valuesArr;
}

function getAlertHistoryTimestamps() {
    const currentTime = ((new Date()).getTime()) * 1000;
    const start = (currentTime - Math.floor((Math.random() * 2000000 * 60 * 1000)));
    const end = start - Math.floor((Math.random() * 5000 * 60 * 1000));
    return {
        startTimestamp: start,
        endTimestamp: end
    };
}

const stubAlerts = [
    {
        operationName: 'test',
        type: 'durationTP99',
        isHealthy: false,
        timestamp: getRandomTimeStamp(),
        trend: getRandomValues()
    },
    {
        operationName: 'test',
        type: 'failureCount',
        isHealthy: true,
        timestamp: getRandomTimeStamp(),
        trend: getRandomValues()
    },
    {
        operationName: 'test',
        type: 'count',
        isHealthy: true,
        timestamp: getRandomTimeStamp(),
        trend: getRandomValues()
    },
    {
        operationName: 'test',
        type: 'AADuration',
        isHealthy: true,
        timestamp: getRandomTimeStamp(),
        trend: getRandomValues()
    }
];

const stubDetails = {
    history: [
        getAlertHistoryTimestamps(),
        getAlertHistoryTimestamps()
    ]
};

function createStubServiceAlertsStore(alertResults, promise) {
    const store = new ServiceAlertsStore();

    sinon.stub(store, 'fetchServiceAlerts', () => {
        store.alerts = alertResults;
        store.promiseState = promise;
    });

    return store;
}

function createStubAlertDetailsStore(alertDetails, promise, alertSubscriptions) {
    const store = new AlertDetailsStore();

    sinon.stub(store, 'fetchAlertHistory', () => {
        store.alertHistory = alertDetails;
        store.historyPromiseState = promise;
    });

    sinon.stub(store, 'fetchAlertSubscriptions', () => {
        store.alertSubscriptions = alertSubscriptions;
        store.subscriptionsPromiseState = promise;
    });

    sinon.stub(store, 'addNewSubscription', () => {
        store.alertSubscriptions = stubAddedSubscription;
    });

    sinon.stub(store, 'updateSubscription', () => {
        store.alertSubscriptions[0] = {
            subscriptionId: 101,
            dispatcherType: 'slack',
            dispatcherIds: [
                '#updated-subscription-1'
            ]
        };
    });

    sinon.stub(store, 'deleteSubscription', () => {
        store.alertSubscriptions = [{
            subscriptionId: 102,
            dispatcherType: 'smtp',
            dispatcherIds: [
                'stub-subscription@2.com'
            ]
        }];
    });

    return store;
}

describe('<Alerts />', () => {
    it('should render the alerts panel', () => {
        const wrapper = shallow(<Alerts match={stubMatch} location={stubLocation} />);
        expect(wrapper.find('.alerts-panel')).to.have.length(1);
    });
});

describe('<AlertsView />', () => {
    it('should render error if promise is rejected', () => {
        const alertsStore = createStubServiceAlertsStore(stubAlerts, rejectedPromise);
        alertsStore.fetchServiceAlerts();
        const wrapper = mount(<AlertsView location={stubLocation}  defaultPreset={stubDefaultPreset} alertsStore={alertsStore} serviceName={stubService} />);

        expect(wrapper.find('.error-message_text')).to.have.length(1);
        expect(wrapper.find('.tr-no-border')).to.have.length(0);
    });

    it('should render loading if promise is pending', () => {
        const alertsStore = createStubServiceAlertsStore(stubAlerts, pendingPromise);
        alertsStore.fetchServiceAlerts();
        const wrapper = mount(<AlertsView location={stubLocation}  defaultPreset={stubDefaultPreset} alertsStore={alertsStore} serviceName={stubService} />);

        expect(wrapper.find('.loading')).to.have.length(1);
        expect(wrapper.find('.error-message_text')).to.have.length(0);
        expect(wrapper.find('.tr-no-border')).to.have.length(0);
    });

    it('should render the Active Alerts Table', () => {
        const alertsStore = createStubServiceAlertsStore(stubAlerts, fulfilledPromise);
        alertsStore.fetchServiceAlerts();
        const wrapper = mount(<AlertsView location={stubLocation}  defaultPreset={stubDefaultPreset} alertsStore={alertsStore} serviceName={stubService} />);

        expect(wrapper.find('.loading')).to.have.length(0);
        expect(wrapper.find('.error-message_text')).to.have.length(0);
        expect(wrapper.find('.tr-no-border')).to.have.length(2);
    });
});

describe('<AlertDetails />', () => {
    it('should render error if promise is rejected', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, rejectedPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.error-message_text')).to.have.length(2);
        expect(wrapper.find('.loading')).to.have.length(0);
        expect(wrapper.find('.subscription-row')).to.have.length(0);
        expect(wrapper.find('.alert-history')).to.have.length(0);
    });

    it('should render loading if promise is pending', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, pendingPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.loading')).to.have.length(2);
        expect(wrapper.find('.error-message_text')).to.have.length(0);
        expect(wrapper.find('.subscription-row')).to.have.length(0);
        expect(wrapper.find('.alert-history')).to.have.length(0);
    });
    it('should render the alert details with successful details promise', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.loading')).to.have.length(0);
        expect(wrapper.find('.error-message_text')).to.have.length(0);
        expect(wrapper.find('.subscription-row')).to.have.length(2);
        expect(wrapper.find('.alert-history')).to.have.length(1);
    });
    it('should successfully add a subscription', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(2);

        wrapper.find('.btn-success').first().simulate('click');
        wrapper.find('.alert-details__input').instance().value = '#updated-subscription-1';
        wrapper.find('.ti-plus').first().simulate('click');

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(3);
    });

    it('should successfully delete a subscription', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(2);

        wrapper.find('.ti-trash').first().simulate('click');

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(1);
    });

    it('should successfully delete a subscription', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(2);

        wrapper.find('.ti-trash').first().simulate('click');

        expect(wrapper.find('.alert-subscription-handle')).to.have.length(1);
    });

    it('should change modify state when subscription modify button is pressed', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);

        wrapper.find('.alert-modify').first().simulate('click');
        expect(wrapper.find('.alert-modify-submit')).to.have.length(1);

        wrapper.find('.alert-modify-cancel').simulate('click');
        expect(wrapper.find('.alert-modify-submit')).to.have.length(0);
    });

    it('should successfully update a subscription', () => {
        const detailsStore = createStubAlertDetailsStore(stubDetails, fulfilledPromise, stubSubscriptions);
        const wrapper = mount(<MemoryRouter><AlertDetails alertDetailsStore={detailsStore} serviceName={stubService} operationName={'op'} type={'count'}/></MemoryRouter>);
        wrapper.find('.alert-modify').first().simulate('click');
        wrapper.find('.alert-modify-submit').simulate('click');

        // Get new value (placeholder) of subscription name
        const newTarget = wrapper.find('.alert-subscription-handle').first();
        expect(newTarget.prop('placeholder')).to.equal('#stub-subscription-1');
    });
});
