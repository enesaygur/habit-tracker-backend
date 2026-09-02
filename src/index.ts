import express from "express";
import homeRoutes from "./routes/homeRoutes";

const app = express();
const PORT = 3000;

app.use("/", homeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
