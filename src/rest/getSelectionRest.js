import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"
import {validId, validOid} from "../validations"


const router = Router()
module.exports = router

router.get("/api/selection/:_id",
    validId,
    run(filter => col(ENV.DB_COLLECTION).findOne(filter))
)

router.get("/api/selection/owner/:oid",
    validOid,
    run(filter => col(ENV.DB_COLLECTION).find(filter).toArray())
)