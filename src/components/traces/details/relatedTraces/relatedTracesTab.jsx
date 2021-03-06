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

import React from 'react';
import PropTypes from 'prop-types';
import {PropTypes as MobxPropTypes} from 'mobx-react';

import RelatedTracesRow from './relatedTracesRow';
import linkBuilder from '../../../../utils/linkBuilder';

export default class relatedTracesTab extends React.Component {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        relatedTraces: MobxPropTypes.observableArray
    };

    static defaultProps = {
        relatedTraces: []
    };

    constructor(props) {
        super(props);
        const numDisplayedTraces = 5;
        this.state = {
            numDisplayedTraces // compute the fields of the original trace
        };

        this.showMoreTraces = this.showMoreTraces.bind(this);
    }

    showMoreTraces() {
        const traceUrl = linkBuilder.withAbsoluteUrl(linkBuilder.universalSearchTracesLink(this.props.searchQuery));

        const tab = window.open(traceUrl, '_blank');
        tab.focus();
    }

    render() {
        const {relatedTraces} = this.props;
        const {numDisplayedTraces} = this.state;

        const relatedTracesList = relatedTraces.slice(0, numDisplayedTraces);

        return (
            <article>
                <table className="trace-trend-table">
                    <thead className="trace-trend-table_header">
                        <tr>
                            <th width="20" className="trace-trend-table_cell">Start Time</th>
                            <th width="30" className="trace-trend-table_cell">Root</th>
                            <th width="20" className="trace-trend-table_cell">Root Success</th>
                            <th width="60" className="trace-trend-table_cell">Span Count</th>
                            <th width="20" className="trace-trend-table_cell text-right">Total Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        relatedTracesList.map(relatedTrace => (
                            <RelatedTracesRow
                                key={relatedTrace.traceId}
                                {...relatedTrace}
                            />
                        ))
                    }
                    </tbody>
                </table>
                <span style={{position: 'absolute', marginLeft: '10px', marginTop: '5px'}}> {relatedTraces.length > numDisplayedTraces ? `5 of ${relatedTraces.length} Results` : 'End of Results'}</span>
                <div style={{textAlign: 'center', marginTop: '15px'}}>
                    <a role="button" className="btn btn-default" onClick={this.showMoreTraces} tabIndex="-1">{relatedTraces.length > numDisplayedTraces ? `Show All(${relatedTraces.length}) in Universal` : 'View in Universal Search' }</a>
                </div>
            </article>
        );
    }
}
