import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';

class CustomCell extends React.Component {

    render() {
        const value = this.props.dataItem[this.props.field];
        return (
            <td>
            <select style = {{ display: "block"}}>

                <option value="Unverified">Unverified</option>
                <option value="Correct">Correct</option>
                <option value="Incorrect">Incorrect</option>

            </select>
            </td>
        );
    }
}

export default CustomCell;
