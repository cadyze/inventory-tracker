"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography, TextField } from '@mui/material';
import UploadImage from './components/UploadImage';
import { firestore } from './firebase';
import { collection, getDocs, setDoc, deleteDoc, doc, getDoc, query } from "firebase/firestore";

interface InventoryItem {
  itemName: string;
  quantity: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const inventoryCollection = collection(firestore, 'inventory');
      const inventorySnapshot = await getDocs(inventoryCollection);
      const inventoryList = inventorySnapshot.docs.map(doc => ({
        itemName: doc.id,
        quantity: doc.data().quantity
      })) as InventoryItem[];
      
      setInventory(inventoryList);
    };

    fetchInventory();
  }, []);
  
  const updateQuantityInFirestore = async (itemName: string, quantity: number) => {
    const itemRef = doc(firestore, 'inventory', itemName);
    await setDoc(itemRef, { quantity }, { merge: true });
  };
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    let inventoryList: InventoryItem[] = [];
    docs.forEach((doc) => {
      const {quantity} = doc.data()
      inventoryList.push({
        itemName: doc.id,
        quantity: quantity,
      })
    }); 
    setInventory(inventoryList)
  }

  const addItem = async (itemName: string) => {
    itemName = itemName.toUpperCase();
  
    let docRef = doc(collection(firestore, 'inventory'), itemName);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory();
  };
  
  
  const removeItem = async (itemName: string) => {
    setInventory((prevInventory) => prevInventory.filter(item => item.itemName !== itemName));

    const itemRef = doc(firestore, 'inventory', itemName);
    await deleteDoc(itemRef);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h1" align='center'>Inventory Manager</Typography>

      <UploadImage addItem={addItem} />

      <Box border={"5px solid #333"} sx={{borderRadius: '16px'}}>
        <Box width={"100%"} height={"100px"} bgcolor={"#ADD8E6"} alignItems={"center"} justifyContent={"center"} display={"flex"} sx={{borderRadius: "16px"}}>
          <Typography>Inventory Items</Typography>
        </Box>

      <Stack width={"100%"} height="90%" spacing={2} overflow={"auto"} sx={{borderRadius: '16px'}}>
        {inventory.map(({ itemName, quantity }) => (
          <Box 
            key={itemName} 
            width="100% - 10px"
            minHeight={"150px"} 
            display={"flex"} 
            alignItems={"center"} 
            justifyContent={"space-between"} 
            bgcolor={"#f0f0f0"} 
            padding={5}
            sx={{boxShadow: 10, borderRadius: '16px'}}
          >
            <Typography variant="h3" color="#333" textAlign={"center"}>
              {itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase()}
            </Typography>

            <TextField 
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10);

                setInventory(prevInventory => 
                  prevInventory.map(item => 
                    item.itemName === itemName ? { ...item, quantity: newQuantity } : item
                  )
                );
              }}
              onBlur={async () => {
                await updateQuantityInFirestore(itemName, quantity);
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await updateQuantityInFirestore(itemName, quantity);
                }
              }}
              sx={{ width: 100 }}
            />

            <Button variant="contained" onClick={() => removeItem(itemName)} sx={{borderRadius:'16px'}}>Remove Item</Button>
          </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  );
}
