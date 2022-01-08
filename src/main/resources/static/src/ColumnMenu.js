import React from 'react';
import {
    GridColumnMenuSort,
    GridColumnMenuFilter
} from '@progress/kendo-react-grid';

export default class ColumnMenu extends React.PureComponent {
    render() {
        return (
        <div>
            <GridColumnMenuSort {...this.props} />
            <GridColumnMenuFilter {...this.props} />
        </div>);
    }
}
