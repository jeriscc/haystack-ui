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

/* eslint-disable react/prop-types, no-unused-expressions */

import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import { MemoryRouter } from 'react-router-dom';
import {observable} from 'mobx';
import ReactGA from 'react-ga';

import Traces from '../../../../src/components/traces/traces';
import SearchBar from '../../../../src/components/traces/searchBar/searchBar';
import TraceResults from '../../../../src/components/traces/results/traceResults';
import {TracesSearchStore} from '../../../../src/components/traces/stores/tracesSearchStore';
import {SearchableKeysStore} from '../../../../src/components/traces/stores/searchableKeysStore';
import {TraceDetailsStore} from '../../../../src/components/traces/stores/traceDetailsStore';
import {SearchBarUiStateStore} from '../../../../src/components/traces/searchBar/searchBarUiStateStore';
import Autocomplete from '../../../../src/components/traces/utils/autocomplete';
import {OperationStore} from '../../../../src/stores/operationStore';
import {ServiceStore} from '../../../../src/stores/serviceStore';
import TraceDetails from '../../../../src/components/traces/details/traceDetails';
import RelatedTracesTabContainer from '../../../../src/components/traces/details/relatedTraces/relatedTracesTabContainer';
import RelatedTracesTab from '../../../../src/components/traces/details/relatedTraces/relatedTracesTab';
import RelatedTracesRow from '../../../../src/components/traces/details/relatedTraces/relatedTracesRow';
import linkBuilder from '../../../../src/utils/linkBuilder';

const stubLocation = {
    search: '?key1=value&key2=value'
};

const stubHistory = {
    location: {
        search: '?key1=value&key2=value'
    },
    push: (location) => {
        stubLocation.search = location.search;
    }
};

const stubMatch = {
    params: {
        serviceName: 'abc-service'
    }
};

const stubSearchableKeys = ['traceId', 'spanId', 'serviceName', 'operationName', 'error'];

const fulfilledPromise = {
    case: ({fulfilled}) => fulfilled()
};

const rejectedPromise = {
    case: ({rejected}) => rejected()
};

const pendingPromise = {
    case: ({pending}) => pending()
};

const stubResults = [
    {
        traceId: '15b83d5f-64e1-4f69-b038-aaa23rfn23r',
        root: {
            url: 'test-1',
            serviceName: 'test-1',
            operationName: 'test-1'
        },
        operationName: 'dummy',
        rootError: false,
        spanCount: 12,
        serviceName: 'abc-service',
        services: observable.array([
            {
                name: 'abc-service',
                duration: 89548,
                spanCount: 12
            },
            {
                name: 'def-service',
                duration: 89548,
                spanCount: 29
            },
            {
                name: 'ghi-service',
                duration: 89548,
                spanCount: 31
            }
        ]),
        error: true,
        startTime: 1499975993,
        duration: 89548
    },
    {
        traceId: '23g89z5f-64e1-4f69-b038-c123rc1c1r1',
        root: {
            url: 'test-2',
            serviceName: 'test-2',
            operationName: 'test-2'
        },
        operationName: 'dummy',
        rootError: false,
        spanCount: 11,
        serviceName: 'abc-service',
        services: observable.array([
            {
                name: 'abc-service',
                duration: 1000000,
                spanCount: 11
            },
            {
                name: 'def-service',
                duration: 89548,
                spanCount: 12
            },
            {
                name: 'ghi-service',
                duration: 89548,
                spanCount: 12
            }
        ]),
        error: false,
        startTime: 1499985993,
        duration: 17765
    }
];

const stubDetails = [
    {
        traceId: 'test-trace-id',
        spanId: 'test-span-1',
        serviceName: 'test-service',
        operationName: 'test',
        startTime: 1504784384000,
        duration: 3500000,
        logs: [
            {
                timestamp: 1504784384000,
                fields: [{
                    key: 'event',
                    value: 'sr'
                    },
                    {
                        key: 'event',
                        value: 'cs'
                    }
                ]
            }
        ],
        tags: [
            {
                key: 'success',
                value: 'true'
            }
        ]
    },
    {
        traceId: 'test-trace-id',
        spanId: 'test-span-2',
        parentSpanId: 'test-span-1',
        serviceName: 'test-service',
        operationName: 'test',
        startTime: 1504785384000,
        duration: 2000000,
        logs: [
            {
                timestamp: 1504784384000,
                fields: [{
                    key: 'event',
                    value: 'sr'
                    },
                    {
                        key: 'event',
                        value: 'cs'
                    }
                ]
            }
        ],
        tags: [
            {
                key: 'success',
                value: 'false'
            }
        ]
    },
    {
        traceId: 'test-trace-id',
        spanId: 'test-span-3',
        parentSpanId: 'test-span-1',
        serviceName: 'test-service',
        operationName: 'test',
        startTime: 1504785384000,
        duration: 2000000,
        logs: [
            {
                timestamp: 1504784384000,
                fields: [{
                    key: 'event',
                    value: 'sr'
                    },
                    {
                        key: 'event',
                        value: 'cs'
                    }
                ]
            }
        ],
        tags: [
            {
                key: 'success',
                value: 'false'
            }
        ]
    },
    {
        traceId: 'test-trace-id',
        spanId: 'test-span-4',
        parentSpanId: 'test-span-1',
        serviceName: 'test-service',
        operationName: 'test',
        startTime: 1504785384000,
        duration: 2000000,
        logs: [
            {
                timestamp: 1504784384000,
                fields: [{
                    key: 'event',
                    value: 'sr'
                    },
                    {
                    key: 'event',
                    value: 'cs'
                    }
                ]
            }
        ],
        tags: [
            {
                key: 'success',
                value: 'false'
            }
        ]
    }
];

function createOperationStubStore() {
    const store = new OperationStore();
    store.operations = [];
    sinon.stub(store, 'fetchOperations', () => {});
    return store;
}

function createServiceStubStore() {
    const store = new ServiceStore();
    store.services = [];
    sinon.stub(store, 'fetchServices', () => {});
    return store;
}

function createSearchableKeysStore(results) {
    const store = new SearchableKeysStore();
    store.keys = observable.array(results);
    sinon.stub(store, 'fetchKeys', () => []);
    return store;
}

function createUIStateStore() {
    const store = new SearchBarUiStateStore();
    const query = {
        serviceName: 'test-service'
    };
    store.initUsingQuery(query);
    return store;
}


function TracesStubComponent({tracesSearchStore, history, location, match}) {
    return (<section className="traces-panel">
        <SearchBar
            tracesSearchStore={tracesSearchStore}
            searchableKeysStore={createSearchableKeysStore()}
            serviceStore={createServiceStubStore()}
            operationStore={createOperationStubStore()}
            history={history}
            location={location}
            match={match}
        />
        <TraceResults tracesSearchStore={tracesSearchStore} history={history} location={{}}/>
    </section>);
}

function TraceDetailsStubComponent({traceDetailsStore, traceId, location, baseServiceName}) {
    return (<TraceDetails traceId={traceId} location={location} baseServiceName={baseServiceName} traceDetailsStore={traceDetailsStore} isUniversalSearch={false} />);
}

function RelatedTracesContainerStub({traceId, store}) {
    return (<RelatedTracesTabContainer traceId={traceId} store={store} />);
}

function handleExpectedRejections(reason) {
    // These two rejections are expected, so we share exclude them from being logged
    if (reason !== 'Field is not selected' && reason !== 'This trace does not have the chosen field') {
        console.log('REJECTION', reason); // eslint-disable-line no-console
    }
}

function createStubStore(results, promise, searchQuery = {}) {
    const store = new TracesSearchStore();
    sinon.stub(store, 'fetchSearchResults', () => {
        store.searchResults = results;
        promise ? store.traceResultsPromiseState = promise : null;
        store.searchQuery = searchQuery;
    });

    return store;
}

function createStubDetailsStore(spans, promise, relatedTracesPromise = fulfilledPromise, relatedResults = []) {
    const store = new TraceDetailsStore();
    sinon.stub(store, 'fetchTraceDetails', () => {
        store.spans = observable.array(spans);
        store.promiseState = promise;
    });
    sinon.stub(store, 'fetchRelatedTraces', (query) => {
        store.relatedTraces = observable.array(relatedResults);
        store.relatedTracesPromiseState = relatedTracesPromise;
        store.searchQuery = query;
    });

    return store;
}

before((done) => {
    ReactGA.initialize('foo', { testMode: true });
    done();
});

describe('<Traces />', () => {
    it('should render Traces panel container', () => {
        const wrapper = shallow(<Traces history={stubHistory} location={stubLocation} match={stubMatch} />);
        expect(wrapper.find('.traces-panel')).to.have.length(1);
    });

    it('has custom time range picker functionality', () => {
        const tracesSearchStore = createStubStore([]);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        // Clicking modal
        expect(wrapper.find('.timerange-picker')).to.have.length(0);
        wrapper.find('.time-range-picker-toggle').simulate('click');
        expect(wrapper.find('.timerange-picker')).to.have.length(1);

        // Changing presets
        wrapper.find('.timerange-picker__preset').first().simulate('click');
        expect(wrapper.find('.time-range-picker-toggle')).to.have.length(1);
        expect(wrapper.find('.timerange-picker')).to.have.length(0);

        // Custom time picker
        wrapper.find('.time-range-picker-toggle').simulate('click');
        wrapper.find('.datetimerange-picker').first().simulate('click');
        wrapper.find('.rdtOld').first().simulate('click');
        wrapper.find('.timerange-picker__presets__listblock').simulate('click');
        wrapper.find('.custom-timerange-apply').simulate('click');
        expect(wrapper.find('.timerange-picker')).to.have.length(0);

        // Clicking off hides modal
        wrapper.find('.time-range-picker-toggle').simulate('click');
        expect(wrapper.find('.timerange-picker')).to.have.length(1);
        wrapper.find('.search-bar-headers_fields').simulate('click');
        expect(wrapper.find('.timerange-picker')).to.have.length(1);
    });

    it('should trigger fetchSearchResults on mount', () => {
        const tracesSearchStore = createStubStore([]);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(wrapper.find('.traces-panel')).to.have.length(1);
        expect(tracesSearchStore.fetchSearchResults.calledOnce);
    });

    it('should render service selection menu when traces are the only subsystem', () => {
        const tracesSearchStore = createStubStore([]);
        window.haystackUiConfig.subsystems = ['traces'];
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(wrapper.find('.search-bar-headers_service')).to.have.length(1);
    });

    it('should render results after getting search results', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(tracesSearchStore.fetchSearchResults.callCount).to.equal(1);
        expect(wrapper.find('.react-bs-table-container')).to.have.length(1);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(2);
    });

    it('should render error if promise is rejected', () => {
        const tracesSearchStore = createStubStore(stubResults, rejectedPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(wrapper.find('.error-message_text')).to.have.length(1);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(0);
    });

    it('should render loading while promise is pending', () => {
        const tracesSearchStore = createStubStore(stubResults, pendingPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(wrapper.find('.loading')).to.have.length(1);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(0);
    });

    it('should update search results on clicking search', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        wrapper.find('.results-header').at(0).simulate('click');
        let traceIdA = wrapper.find('tr.tr-no-border').at(0).children().first();
            traceIdA = traceIdA.props().children;
        wrapper.find('.results-header').at(0).simulate('click');
        let traceIdB = wrapper.find('tr.tr-no-border').at(0).children().first();
            traceIdB = traceIdB.props().children;
        expect(traceIdA).to.not.equal(traceIdB);

        wrapper.find('.results-header').at(4).simulate('click');
        traceIdA = wrapper.find('tr.tr-no-border').at(0).children().first();
        traceIdA = traceIdA.props().children;
        wrapper.find('.results-header').at(4).simulate('click');
        traceIdB = wrapper.find('tr.tr-no-border').at(0).children().first();
        traceIdB = traceIdB.props().children;
        expect(traceIdA).to.not.equal(traceIdB);
    });

    it('should sort based on whatever row is clicked', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        wrapper.find('.traces-search-button').simulate('click');

        expect(tracesSearchStore.fetchSearchResults.callCount).to.equal(2);
        expect(wrapper.find('.react-bs-table-container')).to.have.length(1);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(2);
    });

    it('should be able to sort on columns after getting search results', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        wrapper.find('.results-header').at(1).simulate('click');
        wrapper.find('.results-header').at(1).simulate('click');
        wrapper.find('.results-header').at(2).simulate('click');
        wrapper.find('.results-header').at(2).simulate('click');
        wrapper.find('.results-header').at(3).simulate('click');
        wrapper.find('.results-header').at(3).simulate('click');
        wrapper.find('.results-header').at(4).simulate('click');
        wrapper.find('.results-header').at(4).simulate('click');

        expect(wrapper.find('.react-bs-table-container')).to.have.length(1);
        expect(wrapper.find('.react-bs-table-container tr.tr-no-border td').at(0).text()).to.eq('23g89z5f-64e1-4f69-b038-c123rc1c1r1'); // should be sorted by duration at the end
    });

    it('should not show search results list on empty promise', () => {
        const tracesSearchStore = createStubStore(stubResults);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        expect(wrapper.find('.no-search_text')).to.have.length(1);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(0);
    });

    it('should not show search results list on empty results', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<TracesStubComponent tracesSearchStore={tracesSearchStore} history={stubHistory} location={stubLocation} match={stubMatch}/>);

        tracesSearchStore.fetchSearchResults.restore();
        sinon.stub(tracesSearchStore, 'fetchSearchResults', () => {
            tracesSearchStore.searchResults = [];
        });
        wrapper.find('.traces-search-button').simulate('click');

        expect(tracesSearchStore.fetchSearchResults.callCount).to.equal(1);
        expect(wrapper.find('.react-bs-table-container')).to.have.length(0);
        expect(wrapper.find('tr.tr-no-border')).to.have.length(0);
    });

    it('should not accept invalid query string parameters', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<SearchBar
            tracesSearchStore={tracesSearchStore}
            searchableKeysStore={createSearchableKeysStore(stubSearchableKeys)}
            serviceStore={createServiceStubStore()}
            operationStore={createOperationStubStore()}
            history={stubHistory}
            location={stubLocation}
            match={stubMatch}
        />);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'testing no key value'}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(1);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'failure'}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(1);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'this=is wrong format ='}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(1);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'a=b c d=e'}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(1);
    });

    it('should accept valid query string parameters', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<SearchBar
            tracesSearchStore={tracesSearchStore}
            searchableKeysStore={createSearchableKeysStore(stubSearchableKeys)}
            serviceStore={createServiceStubStore()}
            operationStore={createOperationStubStore()}
            history={stubHistory}
            location={stubLocation}
            match={stubMatch}
        />);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'testing=key value=pair'}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(0);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'testing = key value = pair'}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(0);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: '   testing   =   key value   =   pair   '}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(0);

        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'testing = key        value = pair '}});
        wrapper.find('.traces-search-button').simulate('click');

        expect(wrapper.find('.traces-error-message_item')).to.have.length(0);
    });

    it('should have an autosuggest feature for keys in traces header search', () => {
        const tracesSearchStore = createStubStore(stubResults, fulfilledPromise);
        const wrapper = mount(<SearchBar
            tracesSearchStore={tracesSearchStore}
            searchableKeysStore={createSearchableKeysStore(stubSearchableKeys)}
            serviceStore={createServiceStubStore()}
            operationStore={createOperationStubStore()}
            history={stubHistory}
            location={stubLocation}
            match={stubMatch}
        />);

        wrapper.find('.search-bar-text-box').simulate('click');
        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: ''}});
        wrapper.find('.search-bar-text-box').simulate('keyDown', {keyCode: 65});
        expect(wrapper.find('.autofill-suggestion')).to.have.length(5);
        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: ''}});
        wrapper.find('.search-bar-text-box').simulate('click');
        expect(wrapper.find('.autofill-suggestion')).to.have.length(5);
    });

    it('trace search bar autocomplete should be selectable by keyboard and mouse', () => {
        const store = createUIStateStore();
        const options = observable.array(['test-1', 'test-2', 'test-3']);
        const wrapper = mount(<Autocomplete options={options} uiState={store}/>);
        wrapper.find('.search-bar-text-box').simulate('change', {target: {value: 'test'}});
        wrapper.find('.search-bar-text-box').simulate('keyDown', {keyCode: 38});
        wrapper.find('.search-bar-text-box').simulate('keyDown', {keyCode: 40});
        wrapper.find('.search-bar-text-box').simulate('keyDown', {keyCode: 38});
        expect(wrapper.find('.autofill-suggestion')).to.have.length(3);
        wrapper.find('.search-bar-text-box').simulate('keyDown', {keyCode: 13});
        expect(wrapper.find('.search-bar-text-box').prop('value')).to.equal('test-3=');
    });

    describe('<TraceDetails />', () => {
        describe('Timeline View', () => {
            it('renders the all spans in the trace', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);

                expect(wrapper.find('.span-bar')).to.have.length(stubDetails.length);
            });

            it('renders the descendents on Span Click', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);
                const parentSpan = wrapper.find('[id="test-span-1"]');
                expect(wrapper.find('.span-bar')).to.have.length(4);
                parentSpan.simulate('click');
                expect(wrapper.find('.span-bar')).to.have.length(1);
            });

            it('properly renders the time pointers to depict duration', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);
                const timePointers = wrapper.find('.time-pointer');

                expect(timePointers).to.have.length(5);
                expect((timePointers).last().text()).to.eq('3.500s ');
            });

            it('has a modal upon clicking a span', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise);
                const wrapper = mount(<MemoryRouter>
                    <TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} history={stubHistory} />
                </MemoryRouter>);
                wrapper.find('.span-click').first().simulate('click');
                const modal = wrapper.find('SpanDetailsModal').first();
                expect(modal.props().isOpen).to.be.true;
            });
        });
        describe('RelatedTraces View', () => {
            before(() => {
                process.on('unhandledRejection',  handleExpectedRejections);
            });
            after(() => {
                process.removeListener('unhandledRejection', handleExpectedRejections);
            });
            it('exists and renders correctly', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);
                expect(wrapper.find('a#related-view')).to.have.length(1);
                wrapper.find('a#related-view').simulate('click');
                // By default, no field should be selected and the fetchRelatedTraces promise should be rejected.
                expect(wrapper.find('Error[errorMessage="Field is not selected"]')).to.have.length(1);
                // We expect 9 options because there are 7 time preset options and two relate by options (one empty, one 'success').
                expect(wrapper.find('option')).to.have.length(10);
            });

            it('should render error when no traces are found', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise, fulfilledPromise, []);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);
                wrapper.find('a#related-view').simulate('click');
                wrapper.find('select#field').simulate('change', {target: { value: 0}});
                expect(wrapper.find('.error-message_text p').text()).to.equal('No related traces found');
            });

            it('should render loading while promise is pending', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise, pendingPromise);
                const wrapper = mount(<TraceDetailsStubComponent traceId={stubDetails[0].traceId} location={stubLocation} baseServiceName={stubDetails[0].serviceName} traceDetailsStore={traceDetailsStore} />);
                wrapper.find('a#related-view').simulate('click');
                wrapper.find('select#field').simulate('change', {target: { value: 0}});
                expect(wrapper.find('.loading')).to.have.length(1);
            });

            it('should render related traces with the correct query', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise, fulfilledPromise, stubResults);
                // The fetchTraceDetails method needs to be called before rendering the Related Traces view
                traceDetailsStore.fetchTraceDetails();
                const wrapper = mount(<RelatedTracesContainerStub traceId={stubDetails[1].traceId} store={traceDetailsStore}/>);
                // Selected field "success" and time '15m' to query relatedTraces
                wrapper.find('select#field').simulate('change', {target: { value: 0}});
                wrapper.find('select#time').simulate('change', {target: { value: 1}});
                // Expects that the dictionary of tags was successfully built
                expect(wrapper.props().store.tags.success).to.equal('false');
                // Expects that the searchQuery has the correct field and timepreset to find related traces
                expect(wrapper.props().store.searchQuery.success).to.equal('false');
                expect(wrapper.props().store.searchQuery.timePreset).to.equal('15m');
                // Expects two result traces results - in the store and rendered
                expect(wrapper.props().store.relatedTraces.length).to.equal(2);
                expect(wrapper.find('RelatedTracesRow')).to.have.length(2);
            });

            it('should reject when chosen field is not a property of the given trace', () => {
                const traceDetailsStore = createStubDetailsStore(stubDetails, fulfilledPromise, fulfilledPromise, stubResults);
                traceDetailsStore.fetchTraceDetails();
                const wrapper = mount(<RelatedTracesContainerStub traceId={stubDetails[1].traceId} store={traceDetailsStore}/>);
                wrapper.find('select#field').simulate('change', {target: { value: 1}});
                expect(wrapper.find('Error[errorMessage="This trace does not have the chosen field"]')).to.have.length(1);
            });

            it('should trigger the correct function for the show all traces button', () => {
                // mocking window.open and the window object with focus method it returns
                const focusStub = sinon.stub();
                global.window.open = () => ({ focus: focusStub });

                const absStub = sinon.stub(linkBuilder, 'withAbsoluteUrl').returns('string');
                const uniStub = sinon.stub(linkBuilder, 'universalSearchTracesLink').returns('string');

                const wrapper = mount(<RelatedTracesTab searchQuery={{}} relatedTraces={observable.array(stubResults)} />);
                // Click showMoreTraces button
                wrapper.find('a.btn-default').simulate('click');

                expect(absStub.calledOnce).to.equal(true);
                expect(uniStub.calledOnce).to.equal(true);
                expect(focusStub.calledOnce).to.equal(true);

                linkBuilder.withAbsoluteUrl.restore();
                linkBuilder.universalSearchTracesLink.restore();
                delete global.window.open;
            });

            it('should have a related trace that opens in a new tab, universal', () => {
                // mocking window.open and the window object with focus method it returns
                const focusStub = sinon.stub();
                global.window.open = () => ({ focus: focusStub });

                const absStub = sinon.stub(linkBuilder, 'withAbsoluteUrl').returns('string');
                const uniStub = sinon.stub(linkBuilder, 'universalSearchTracesLink').returns('string');

                const wrapper = mount(<table><tbody><RelatedTracesRow key={stubResults[0].traceId} {...stubResults[0]} /></tbody></table>);
                expect(wrapper.find('.trace-trend-table_cell')).to.have.length(5);

                wrapper.find('tr').simulate('click');

                expect(absStub.calledOnce).to.equal(true);
                expect(uniStub.calledOnce).to.equal(true);
                expect(focusStub.calledOnce).to.equal(true);

                linkBuilder.withAbsoluteUrl.restore();
                linkBuilder.universalSearchTracesLink.restore();
                delete global.window.open;
            });
        });
    });
});
