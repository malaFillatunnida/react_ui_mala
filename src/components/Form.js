import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Grid, Paper, Typography, MenuItem, TextField } from "@mui/material";

const Form = () => {
  const {
    register, // untuk mendaftarkan input
    formState: { errors }, // // untuk mengelola status formulir
    setValue, // untuk mengatur nilai input
    watch, // untuk mengamati perubahan nilai
  } = useForm();
  const [users, setUsers] = useState([]); // untuk menyimpan data pengguna yang diambil dari API

  //untuk mengambil data pengguna dari API JSONPlaceholder dan menyimpannya dalam state users
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  // untuk mendapatkan nilai input "username" yang dipilih oleh pengguna
  const selectedUsername = watch("username");

  // Ketika nilainya berubah, kita mencari pengguna yang sesuai dalam array users dan mengatur nilai input "email" menggunakan setValue
  useEffect(() => {
    const selectedUser = users.find(
      (user) => user.username === selectedUsername
    );
    if (selectedUser) {
      setValue("email", selectedUser.email);
    }
  }, [selectedUsername, users, setValue]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={10} textAlign="left">
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Username</Typography>
                <TextField
                  label=""
                  {...register("username", {
                    required: "Username is required",
                  })}
                  error={!!errors.username}
                  fullWidth
                  select
                >
                  <MenuItem value="">Select a username</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.username && (
                  <Typography color="error">
                    {errors.username.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Email</Typography>
                <TextField
                  label=""
                  {...register("email")}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Form;
