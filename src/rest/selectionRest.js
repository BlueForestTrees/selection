import {run, Router} from 'express-blueforest'
import {cols} from "../collections"
import {col} from "mongo-registry"
import {setUserIdIn, validBodyId, validBodyTrunkId, validDuree, validFreq, validName, validQuantity, validUser} from "../validations"

const router = Router()

module.exports = router

router.post(`/api/selection`,
    validBodyId,
    validBodyTrunkId,
    validUser,
    validQuantity,
    validFreq,
    validDuree,
    validName,
    run(setUserIdIn("oid")),
    run(s => col(cols.SELECTION).insertOne(s))
)