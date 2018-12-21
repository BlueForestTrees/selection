import {run, Router} from 'express-blueforest'
import {col} from "mongo-registry"
import ENV from "./../env"
import {setUserIdIn, validId, validTrunkId, validDuree, validFreq, validName, validQuantity, validRepeted, validUser} from "../validations"

const router = Router()

module.exports = router

router.post(`/api/selection`,
    validId,
    validTrunkId,
    ...validQuantity,
    validRepeted,
    validFreq,
    validDuree,
    validName,
    validUser,
    run(setUserIdIn("oid")),
    run(s => col(ENV.DB_COLLECTION).insertOne(s).then(res => res.result))
)