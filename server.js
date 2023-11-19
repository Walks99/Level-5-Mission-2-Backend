require("dotenv").config();

if (require.main === module) {
    // Only start the server if this script is run directly (not required as a module)
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }