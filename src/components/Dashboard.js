// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Replace with your path to firebaseConfig.js
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState([]); // Array to store fetched data
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDataItem, setSelectedDataItem] = useState({}); // For editing
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch data on component mount (replace 'yourCollectionPath' with your actual collection)
  useEffect(() => {
    const getData = async () => {
      try {
        const dataRef = collection(db, 'users');
        const querySnapshot = await getDocs(dataRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbarOpen(true);
        setSnackbarMessage('Error fetching data. Please try again.');
        setSnackbarSeverity('error');
      }
    };
    getData();
  }, []);

  // Functions for CRUD operations (replace placeholders with your data structure and logic)
  const handleCreate = async (newData) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), newData);
      console.log('Document written with ID:', docRef.id);
      setData([...data, { id: docRef.id, ...newData }]); // Update state with new data
      setOpenCreateDialog(false);
      setSnackbarOpen(true);
      setSnackbarMessage('Item created successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error adding document:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Error creating item. Please try again.');
      setSnackbarSeverity('error');
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const { id, ...rest } = updatedData; // Destructure data for update
      await updateDoc(doc(db, 'users', id), rest);
      console.log('Document updated successfully');
      const updatedDataArray = data.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
      setData(updatedDataArray); // Update state with modified data
      setOpenEditDialog(false);
      setSnackbarOpen(true);
      setSnackbarMessage('Item updated successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error updating document:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Error updating item. Please try again.');
      setSnackbarSeverity('error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      console.log('Document deleted successfully');
      const updatedDataArray = data.filter((item) => item.id !== id);
      setData(updatedDataArray); // Update state with deleted item removed
      setSnackbarOpen(true);
      setSnackbarMessage('Item deleted successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error deleting document:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Error deleting item. Please try again.');
      setSnackbarSeverity('error');
    }
  };  const CreateDialog = () => (
    <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
      <DialogContent>
        <DialogContentText>Create New Item</DialogContentText>
        {/* Form fields for new data creation */}
        <TextField
          autoFocus
          margin="dense"
          label="Field 1"
          type="text"
          fullWidth
          onChange={(e) => {
            // Update new item state based on form field changes
            const newData = { ...newData, field1: e.target.value };
            setNewData(newData);
          }}
        />
        {/* ... other form fields as needed, following the same pattern for onChange */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
        <Button onClick={() => handleCreate(newData)}>Create</Button>
      </DialogActions>
    </Dialog>
  );

  const [newData, setNewData] = useState({}); // State for new item data in CreateDialog

  const EditDialog = () => (
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogContent>
        <DialogContentText>Edit Item</DialogContentText>
        {/* Form fields for editing data, pre-populated with selected item data */}
        <TextField
          autoFocus
          margin="dense"
          label="Field 1"
          type="text"
          fullWidth
          defaultValue={selectedDataItem.field1} // Replace with actual field names
          onChange={(e) => {
            // Update selected item data state based on form field changes
            setSelectedDataItem({ ...selectedDataItem, field1: e.target.value });
          }}
        />
        {/* ... other form fields as needed, following the same pattern for defaultValue and onChange */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
        <Button onClick={() => handleEdit(selectedDataItem)}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  // ... other parts of your Dashboard component
};
export default Dashboard;