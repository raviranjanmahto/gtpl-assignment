const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.use(authController.protect);

router.get("/", userController.getUsers);
router.get("/current", userController.getCurrentUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/logout", userController.logout);

module.exports = router;
