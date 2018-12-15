import {objectNoEx} from "mongo-registry"
import jwt from "jsonwebtoken"

const mongoId = chain => chain.exists().withMessage("missing").isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)
export const validBodyId = mongoId(body("_id"))
export const validBodyTrunkId = mongoId(body("trunkId"))
export const validUser = run((o, req) => {
    let token = jwt.decode(req.headers[X_ACCESS_TOKEN])
    if (!token || !token.user) {
        throw {code: "bf401"}
    }
    req.user = token.user
    req.user._id = object(req.user._id)
    debug("user %o", req.user)
    return o
})


export const setUserIdIn = field => (o, req) => {
    o[field] = req.user._id
    return o
}

export const validQuantity = chain => chain.exists()
    .withMessage("quantity required {bqt,g}")

export const validFreq = null
export const validDuree = null
export const validName = null