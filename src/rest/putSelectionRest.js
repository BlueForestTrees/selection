import {Router, run} from "express-blueforest"
import {col} from "mongo-registry"
import ENV from "./../env"

import {
    setUserIdIn,
    validId,
    validUser,
    validOwner, validTrunkId, validQuantity, validRepeted, validFreq, validDuree, validName
} from "../validations"

const router = Router()

module.exports = router

router.put("/api/selection",
    validId,
    validTrunkId,
    ...validQuantity,
    validRepeted,
    validFreq,
    validDuree,
    validName,
    validUser,
    validOwner(col(ENV.DB_COLLECTION)),
    run(setUserIdIn("oid")),
    run(info => col(ENV.DB_COLLECTION).updateOne({_id: info._id}, {$set: info}).then(resp => resp.result))
)