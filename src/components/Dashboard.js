import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc,doc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { db } from '../firebaseConfig'; // Replace with your path to firebaseConfig.js
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
      const fetchUsers = async () => {
        const q = query(collection(db, 'users'), where('name', '>=', searchName), where('name', '<=', searchName + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersData);
        });
  
        return unsubscribe;
      };
  
      fetchUsers();
    }, [searchName]);
  
    const handleAddUser = async () => {
      if (name.trim() !== '' && age.trim() !== '') {
        try {
          await addDoc(collection(db, 'users'), {
            name: name,
            age: age
          });
          setName('');
          setAge('');
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      }
    };
  
    const handleUpdateUser = async (id) => {
        const userToUpdate = users.find(user => user.id === id);
        if (userToUpdate) {
          try {
            await updateDoc(doc(db, 'users', id), {
              name: name || userToUpdate.name,
              age: age || userToUpdate.age
            });
            setName('');
            setAge('');
          } catch (error) {
            console.error('Error updating document: ', error);
          }
        }
      };
  
    const handleDeleteUser = async (id) => {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    };
  
    return (
      <div>
        <h2>Dashboard</h2>
        <div>
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Age"
            variant="outlined"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" onClick={handleAddUser}>Add User</Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <TextField
                      value={name || user.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={age || user.age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleUpdateUser(user.id)}>Edit</Button>
                    <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
  
  export default Dashboard;
