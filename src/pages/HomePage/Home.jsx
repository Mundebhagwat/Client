import { Box, Button, Container, Typography, AppBar, Toolbar } from "@mui/material";
import { Hotel } from "lucide-react";

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Hotel size={24} />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            LuxeStay
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        textAlign="center"
        p={3}
      >
        <Typography variant="h3" fontWeight="bold" mb={2}>
          Welcome to LuxeStay
        </Typography>
        <Typography variant="h6" color="textSecondary" mb={4}>
          Experience comfort and luxury like never before.
        </Typography>
        <Button variant="contained" color="primary" href="/login" sx={{ m: 1, width: "200px" }}>
          Login
        </Button>
        <Button variant="outlined" color="primary" href="/register" sx={{ m: 1, width: "200px" }}>
          Register
        </Button>
      </Box>

      {/* Footer */}
      <Box bgcolor="grey.900" color="white" textAlign="center" py={2}>
        <Typography variant="body2">&copy; 2025 LuxeStay. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}
