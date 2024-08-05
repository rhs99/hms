import { useState } from 'react';

import './_index.scss';

const Table = (props) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const { title, headers, rows, onRowClick, highlightSelection } = props;

  return (
    <div className="dl-table">
      <h3>{title}</h3>
      <table className="dl-table-table">
        <thead>
          <tr>
            {headers.map((head, idx) => {
              return (
                <th key={idx} className="dl-table-th">
                  {head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, idx) => {
              return (
                <tr
                  key={idx}
                  onClick={() => {
                    if (highlightSelection) {
                      setSelectedRow(row.key);
                    }
                    onRowClick?.(row.key);
                  }}
                  className={`${onRowClick && 'dl-table-tr'} ${row.key === selectedRow && 'dl-table-highlight'}`}
                >
                  {row.value.map((rd, idx) => {
                    return (
                      <td className="dl-table-td" key={idx}>
                        {rd}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr><td>No data found!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
