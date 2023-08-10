import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Paper,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";

const Pokemon = () => {
  const {
    formState: { errors }, // untuk mengelola status formulir
    setValue, // untuk mengatur nilai input
    watch, // untuk mengamati perubahan nilai
  } = useForm();
  const [pokemonList, setPokemonList] = useState([]); // Untuk menyimpan daftar nama-nama Pokemon yang diperoleh dari API
  const [offset, setOffset] = useState(0); // Mengontrol offset pada permintaan API
  const [limit, setLimit] = useState(10); // Menentukan berapa banyak data yang akan dimuat setiap kali
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false); // Menyimpan status apakah tombol "Load More" harus ditampilkan atau tidak

  // Untuk mengambil data Pokemon dari API
  // Setiap kali offset atau limit berubah, permintaan ke API akan dilakukan ulang
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonList(data.results);
        setIsLoadMoreVisible(data.next !== null);
      });
  }, [offset, limit]);

  const selectedPokemon = watch("pokemon", []);

  useEffect(() => {
    setValue("pokemon", selectedPokemon);
  }, [selectedPokemon, setValue]);

  // Fungsi ini digunakan untuk menangani aksi "Load More"
  const handleLoadMore = () => {
    setLimit(limit + 10);
  };

  // Fungsi ini digunakan untuk menghapus pilihan Pokemon dari daftar yang dipilih
  const handleRemovePokemon = (removedPokemon) => {
    const updatedPokemon = selectedPokemon.filter(
      (pokemon) => pokemon !== removedPokemon
    );
    setValue("pokemon", updatedPokemon);
  };

  // Ini adalah array opsi yang akan ditampilkan dan diambil dari daftar Pokemon yang diperoleh dari API
  const autocompleteOptions = [...pokemonList.map((pokemon) => pokemon.name)];

  // Ini adalah variabel boolean yang menunjukkan apakah tombol "Load More" harus ditampilkan di bawah daftar opsi
  if (isLoadMoreVisible) {
    autocompleteOptions.push("Load More");
  }

  // untuk mengakses langsung komponen Autocomplete
  const autocompleteRef = useRef(null);

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
            Choose Pokemon
          </Typography>
          <form>
            <FormControl fullWidth>
              <Autocomplete
                ref={autocompleteRef}
                multiple
                options={autocompleteOptions}
                value={selectedPokemon}
                // untuk memeriksa apakah opsi yang dipilih adalah "Load More" atau bukan. Jika ya, Anda memanggil handleLoadMore() dan kemudian menggunakan setTimeout untuk membuka pop-up Autocomplete setelah penambahan data dilakukan
                onChange={(event, newValue) => {
                  if (newValue.includes("Load More")) {
                    handleLoadMore();
                    setTimeout(() => {
                      autocompleteRef.current
                        .querySelector(".MuiAutocomplete-popupIndicator")
                        .click();
                    }, 100);
                  } else {
                    setValue("pokemon", newValue);
                  }
                }}
                // mencegah penutupan pop-up ketika alasan penutupannya adalah "toggleInput"
                onClose={(event, reason) => {
                  if (reason === "toggleInput") {
                    event.preventDefault();
                  }
                }}
                //  ini digunakan untuk mengganti tampilan elemen input teks yang muncul di atas kotak pilihan (dropdown) komponen 'Autocomplete'
                renderInput={(params) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      {...params}
                      label="Pokemon"
                      error={!!errors.pokemon}
                    />
                  </div>
                )}
                // untuk mengatur tampilan opsi "Load More"
                renderOption={(props, option) => (
                  <li {...props}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        style={
                          option === "Load More"
                            ? {
                                color: "#1976d2",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }
                            : {}
                        }
                      >
                        {option}
                      </Typography>
                    </div>
                  </li>
                )}
              />
              {errors.pokemon && (
                <Typography color="error">
                  Select at least one Pokemon
                </Typography>
              )}
            </FormControl>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Pokemon;
