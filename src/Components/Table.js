import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Table.css"

const Table = (props) => {
    const [appName, setAppName] = useState({});
    useEffect(() => {
        axios.get('https://go-dev.greedygame.com/v3/dummy/apps')
            .then((res) => {
                const k = res.data.data;
                const k1 = {}
                for (let i = 0; i < k.length; i++) {
                    k1[k[i]['app_id']] = k[i]['app_name']
                }
                setAppName(k1)
            })
            .catch(err => console.log(err));
    }, []);

    const { tableData, headerData } = props;

    const tableHeader = () => {
        return headerData.map((data, idx) => {
            return (
                <th key={idx}>{data}</th>
            )
        })
    }

    const getSingleRowData = (rowData) => {
        const ans = []
        for (let i = 0; i < headerData.length; i++) {
            if (headerData[i] === 'app_name')
                ans.push(appName[rowData.app_id])
            else if (headerData[i] === 'fill_rate') {
                ans.push(((rowData.impressions / rowData.requests) * 100).toFixed(2));
            }
            else if (headerData[i] === 'ctr') {
                ans.push(((rowData.clicks / rowData.impressions) * 100).toFixed(2));
            }
            else
                ans.push(rowData[headerData[i]]);

        }
        return ans;
    }

    const returnTableData = () => {
        return tableData.map((todos, idx) => {
            const { app_id, date } = todos;
            return (
                <tr data_id={app_id} key={idx}>
                    {getSingleRowData(todos).map((each, idx2) => <td key={idx2} id={idx2}>{each}</td>)}
                </tr>
            )
        });
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {tableHeader()}
                    </tr>
                </thead>
                <tbody>
                    {returnTableData()}
                </tbody>
            </table>
        </>
    )
}

export default Table;