import React, { useState, useRef, useEffect } from "react";
import './TableHeader.css';
export default function Header(props) {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [list, setList] = useState(['date', 'app_name', 'requests', 'responses', 'impressions', 'clicks', 'revenue', 'fill_rate', 'ctr']);
  const [displayList, setDisplayList] = useState({
    'date': 1,
    'app_name': 1,
    'requests': 1,
    'responses': 1,
    'impressions': 1,
    'clicks': 0,
    'revenue': 0,
    'fill_rate': 0,
    'ctr': 0
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const beginDate1 = params.get("beginDate")
    const endDate1 = params.get("endDate");
    if (beginDate1 === null || endDate1 === null)
      return;
    const newList = list;
    const newDisplayList = {
      'date': 1, 'app_name': 1, 'requests': 0, 'responses': 0,
      'impressions': 0, 'clicks': 0, 'revenue': 0, 'fill_rate': 0, 'ctr': 0
    };

    for (let i = 0; i <= 10; i++) {
      if (params.get(i) !== null) {
        var index = newList.indexOf(params.get(i));
        if (index !== -1) {
          newList.splice(index, 1);
        }
        newList.splice(i, 0, params.get(i))
        console.log(newList);
        newDisplayList[params.get(i)] = 1;
      }
      else {
        break;
      }
    }
    setDisplayList(prev => newDisplayList);
    setList(prev => newList);
    setTimeout(() => {
      handleApplySettings(newList, newDisplayList);
    }, 1000);
  }, [])

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const drop = (e) => {
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);
  };

  const handleApplySettings = (l1, l2) => {
    props.setOrder(l1);
    props.setDisplay(l2);
  }
  const handleDisplay = (e) => {
    const name = e.target.getAttribute('name');
    setDisplayList(prev => ({ ...prev, [name]: (prev[name] === 1 ? 0 : 1) }));
  }
  return (
    <div className="table-header">
      {list.map((item, index) => {
        if (item === 'app_name' || item === 'date') {
          return (<span
            className="fliterbutton fliterbuttondisable fliterbuttonadded"
            key={index}
          >{item}</span>);
        }

        return (
          <span
            className={displayList[item] === 1 ? "fliterbutton fliterbuttonadded" : "fliterbutton"}
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            name={item}
            onClick={(e) => handleDisplay(e)}
            key={index}
            draggable
          >
            {item}
          </span>
        )
      }
      )}
      <button onClick={() => handleApplySettings(list, displayList)}>Apply</button>
    </div>
  );
}
