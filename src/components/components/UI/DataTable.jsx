
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import FilterListIcon from '@mui/icons-material/FilterList';
 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #ddd',
}));
 
const StatusChip = styled('span')(({ status }) => ({
  padding: '5px 10px',
  borderRadius: '15px',
  color: '#fff',
  backgroundColor: status === 'active' ? '#c8f7c5' :
                   status === 'inactive' ? '#d6d6d6' :
                   status === 'archived' ? '#f7c6c7' :
                   status === 'pending' ? '#f7f3c6' : '#fff',
}));
 
const DataTable = () => {
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    email: '',
    status: '',
    role: '',
    lastActive: '',
    subscribed: '',
    amount: '',
  });
 
  const rows = [
    { id: '001', name: 'User 1', email: 'user1@example.com', status: 'archived', role: 'editor', lastActive: 'Oct 24, 2024', subscribed: true, amount: '$369.97' },
    { id: '002', name: 'User 2', email: 'user2@example.com', status: 'inactive', role: 'viewer', lastActive: 'Oct 6, 2024', subscribed: true, amount: '$629.36' },
    { id: '003', name: 'User 3', email: 'user3@example.com', status: 'inactive', role: 'editor', lastActive: 'Jan 27, 2025', subscribed: false, amount: '$135.04' },
    { id: '004', name: 'User 4', email: 'user4@example.com', status: 'active', role: 'viewer', lastActive: 'Dec 7, 2024', subscribed: true, amount: '$808.69' },
    { id: '005', name: 'User 5', email: 'user5@example.com', status: 'archived', role: 'user', lastActive: 'Nov 1, 2024', subscribed: true, amount: '$951.04' },
    { id: '006', name: 'User 6', email: 'user6@example.com', status: 'pending', role: 'viewer', lastActive: 'Feb 27, 2025', subscribed: false, amount: '$791.43' },
    { id: '007', name: 'User 7', email: 'user7@example.com', status: 'archived', role: 'editor', lastActive: 'Dec 30, 2024', subscribed: true, amount: '$523.63' },
    { id: '008', name: 'User 8', email: 'user8@example.com', status: 'pending', role: 'viewer', lastActive: 'Feb 21, 2025', subscribed: true, amount: '$30.52' },
    { id: '009', name: 'User 9', email: 'user9@example.com', status: 'inactive', role: 'user', lastActive: 'Aug 8, 2024', subscribed: false, amount: '$861.48' },
    { id: '010', name: 'User 10', email: 'user10@example.com', status: 'archived', role: 'user', lastActive: 'May 17, 2024', subscribed: false, amount: '$581.76' },
  ];
 
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };
 
  const filteredRows = rows.filter(row => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      return row[key].toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });
 
  return (
    <TableContainer component={Paper}>
      <TextField placeholder="Search all columns..." variant="outlined" size="small" style={{ margin: '10px' ,width:"50%",borderRadius:"10px"}} />
      <Button variant="outlined" style={{ margin: '10px' }}>Show Filters</Button>
      <Button variant="contained" style={{ float: 'right', margin: '10px' }}>Export CSV</Button>
      <Table>
        <TableHead>
          <TableRow>
            {['ID', 'Name', 'Email', 'Status', 'Role', 'Last Active', 'Subscribed', 'Amount'].map((header, index) => (
              <StyledTableCell key={index}>
                {header}
                <IconButton size="small" onClick={() => handleFilterChange(header.toLowerCase(), '')}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                {/* <TextField
                  variant="standard"
                  size="small"
                  value={filters[header.toLowerCase()]}
                  onChange={(e) => handleFilterChange(header.toLowerCase(), e.target.value)}
                  style={{ marginTop: '5px', width: '100%' }}
                /> */}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell><StatusChip status={row.status}>{row.status}</StatusChip></TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.lastActive}</TableCell>
              <TableCell>{row.subscribed ? 'Yes' : 'No'}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Showing 1 to 10 of 100 results</span>
        <div>
          <span>Rows per page: </span>
          <Select value={10} size="small">
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Button size="small">{'<'}</Button>
          <span>1 of 10</span>
          <Button size="small">{'>'}</Button>
        </div>
      </div>
    </TableContainer>
  );
};
 
export default DataTable;