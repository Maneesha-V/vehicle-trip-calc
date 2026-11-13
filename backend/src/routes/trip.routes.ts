import { Router } from "express";
import container from "../config/inversify/container";
import { TYPES } from "../config/inversify/types";
import { ITripController } from "../controllers/interfaces/ITripController";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadCsv } from "../middlewares/upload.middleware";

const router = Router();

const tripController = container.get<ITripController>(TYPES.TripController);

router.use(authenticate); 

router.post("/upload", uploadCsv.single("file"), tripController.upload);
router.get("/", tripController.list);
router.get("/:id", tripController.getById);
router.delete("/:id", tripController.remove);
router.get("/:id/report", tripController.report);

export default router;