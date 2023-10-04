import React from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

function Home() {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={12}>
          <h1><Link style={{ textDecoration: 'none' }} href="/pos"><LocalGroceryStoreIcon />Enter the store</Link></h1>
      </Grid>
    </Grid>
  );
}

export default Home;