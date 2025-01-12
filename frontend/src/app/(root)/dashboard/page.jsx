"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", dob: "" });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [router]);

  // Fetch data from backend using `fetch`
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item`);
      if (!response.ok) {
        throw new Error("Failed to load items");
      }
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      enqueueSnackbar("Failed to load items", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Save or update item
  const handleSave = async () => {
    if (!formData.name || !formData.dob) {
      enqueueSnackbar("Name and Date of Birth are required", { variant: "warning" });
      return;
    }

    try {
      let response;
      if (editingItem) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/${editingItem._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      enqueueSnackbar(editingItem ? "Item updated successfully" : "Item added successfully", { variant: "success" });
      fetchData();
      setDialogOpen(false);
      setFormData({ name: "", dob: "" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      enqueueSnackbar("Item deleted successfully", { variant: "success" });
      fetchData();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // Open dialog for editing or adding a new item
  const openDialog = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { name: item.name, dob: item.dob } : { name: "", dob: "" });
    setDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setFormData({ name: "", dob: "" });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog()}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton variant="text" height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{dayjs().diff(dayjs(item.dob), "year")}</TableCell>
                  <TableCell>{dayjs(item.dob).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDialog(item)} color="primary">
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
