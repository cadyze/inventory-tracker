'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Container, Grid } from "@mui/material";
import { doc, collection, getDocs, query, QueryEndAtConstraint, deleteDoc, getDoc, setDoc} from "firebase/firestore"
import { setLazyProp } from "next/dist/server/api-utils";
import UploadImage from './components/UploadImage';

export default function Home() {
  const [inventory, setInventory ] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        itemName: doc.id,
        ...doc.data(),
      })
    }); 
    setInventory(inventoryList)
  }
  
  const addItem = async (item) => {
    const uppercaseItem = item.toUpperCase() 
    const docRef = doc(collection(firestore, 'inventory'), uppercaseItem)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems={"center"} gap={2} flexDirection={"column"}>
      <Modal open={open} onClose={handleClose}>
        <Box position={"absolute"} top={"50%"} left={"50%"} width={400} border={"2px solid #0000"} bgcolor={"white"} p={4} display={"flex"} flexDirection={"column"} gap={3} boxShadow={24} sx={{transform:"translate(-50%, -50%)"}}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
        
      </Modal>
      <Typography variant="h1">Inventory Manager</Typography>

      {/* Implementing AWS Rekognition */}
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Main Content Section */}
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8}>
            {/* Import and Use the UploadImage component */}
            <UploadImage />
          </Grid>
        </Grid>
      </Container>

      <Button variant="contained" onClick={() => {
        handleOpen()
      }}>Add New Item</Button>
      <Box border={"1px solid #333"}>
        <Box width={"100%"} height={"100px"} bgcolor={"#ADD8E6"} alignItems={"center"} justifyContent={"center"} display={"flex"}>
          <Typography>Inventory Items</Typography>
        </Box>
      <Stack width={"800px"} height="300px" spacing={2} overflow={"auto"}>
        {
          inventory.map(({itemName, quantity}) => (
            <Box key={itemName} width="100%" minHeight={"150px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"} bgcolor={"#f0f0f0"} padding={5}>
              <Typography variant="h3" color="#333" textAlign={"center"}>
                {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign={"center"}>
                {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(itemName)}>Remove Item</Button>
            </Box>
          ))
        }
      </Stack>
    </Box>
    </Box>
  );
}
