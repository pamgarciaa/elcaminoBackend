import express from "express";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import appError from "./src/utils/appError.util.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import authRoutes from "./src/routes/auth.route.js";
import blogRoutes from "./src/routes/blog.route.js";
import productRoutes from "./src/routes/product.route.js";
import kitRoutes from "./src/routes/kit.route.js"; // <--- 1. IMPORTAR
import orderRoutes from "./src/routes/order.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/database.config.js";
import cors from "cors";

const app = express();

dotenv.config();

connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(loggerMiddleware);
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use("/api/users", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
