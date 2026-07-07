import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import sentinelRouter from "./sentinel";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(sentinelRouter);

export default router;
