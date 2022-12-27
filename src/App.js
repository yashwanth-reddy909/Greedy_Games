
import './App.css';
import axios from 'axios';
import Table from './Components/Table';
import Header from './Components/TableHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [data, setData] = useState([]);
  const [beginDate, setBeginDate] = useState('2021-06-01');
  const [endDate, setEndDate] = useState('2021-06-30');
  const history = useNavigate()
  const [tableHeader, setTableHeader] = useState(['date', 'app_name', 'requests', 'responses', 'impressions']);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const beginDate1 = params.get("beginDate")
    const endDate1 = params.get("endDate");
    if (beginDate1 === null || endDate1 === null) {
      getData();
      return;
    }
    setBeginDate(beginDate1);
    setEndDate(endDate1);
    getData();
    // console.log(params.get('page'));
    // console.log(params);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (let i = 0; i < tableHeader.length; i++) {
      params.set(i, tableHeader[i]);
    }
    for (let i = tableHeader.length; i < 10; i++) {
      if (params.get(i) === null) {
        break;
      }
      params.delete(i);
    }
    history({ search: params.toString() })

  }, [tableHeader]);

  const getData = () => {
    if (beginDate > endDate) {
      console.log('BEGIN DATE SHOULD ALWAYS BE LESS THAN ENDDATE');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set('beginDate', beginDate);
    params.set('endDate', endDate);
    history({ search: params.toString() })
    axios.get(`https://go-dev.greedygame.com/v3/dummy/report?startDate=${beginDate}&endDate=${endDate}`)
      .then(res => {
        const k = res.data.data;
        console.log(res.data);
        setData(k);
      })
      .catch(err => {
        console.error(err);
      });

  }
  const setOrder = (list) => {
    setTableHeader(list);
  }
  const setDisplay = (obj) => {
    setTableHeader((current) =>
      current.filter((att) => obj[att] !== 0)
    );
  }

  const dateChangeHandler = (e) => {
    if (e.target.id === "date1")
      setBeginDate(e.target.value);
    else
      setEndDate(e.target.value);
  }

  return (
    <div className="App">
      <div className="controls">
        <label htmlFor="date1">Start Date :</label>
        <input type="date" id='date1' min='2021-06-01' max='2021-06-30' value={beginDate} onChange={dateChangeHandler} />
        <label htmlFor="date2">End Date :</label>
        <input type="date" id='date2' min='2021-06-01' max='2021-06-30' value={endDate} onChange={dateChangeHandler} />
        <button onClick={getData}>Submit</button>
      </div>
      <Header setOrder={setOrder} setDisplay={setDisplay} />
      <Table
        tableData={data}
        headerData={tableHeader} />
    </div>
  );
}

export default App;
