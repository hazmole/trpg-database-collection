import React, { useState } from 'react';

export default function DataTable({ data }) {
  if (!data || data.length === 0) return <p>尚無資料</p>;

  const headers = Object.keys(data[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (header) => {
    if (sortField === header) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(header);
      setSortAsc(true);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <input
        type="text"
        placeholder="搜尋表格資料..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', marginBottom: '12px', width: '100%', maxWidth: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '500px', background: '#fff' }}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th 
                  key={header} 
                  onClick={() => handleSort(header)} 
                  style={{ cursor: 'pointer', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ccc', userSelect: 'none' }}
                >
                  {header} {sortField === header ? (sortAsc ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                {headers.map((header) => (
                  <td key={header} style={{ padding: '10px' }}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}