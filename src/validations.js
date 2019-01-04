import {check, body} from 'express-validator/check'
import {objectNoEx, object} from "mongo-registry"
import jwt from "jsonwebtoken"
import {run} from 'express-blueforest'

export const X_ACCESS_TOKEN = "x-access-token"
const grandeursKeys = ["PNOF", "PDF", "DALY", "CTUh", "CTUe", "Ene1", "Ene2", "Dens", "Nomb", "Volu", "Duré", "Mass", "Surf", "Long", "Pri1", "Pri2", "Tran"]

const grandeur = chain => chain.isIn(grandeursKeys).withMessage("should be Mass, Dens, Long, Tran...")
const mongoId = chain => chain.exists().withMessage("missing").isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)
const number = chain => chain.exists().custom(v => !isNaN(Number.parseFloat(v))).withMessage("must be a valid number").customSanitizer(Number.parseFloat)


export const validId = mongoId(check("_id"))
export const validOid = mongoId(check("oid"))
export const validTrunkId = mongoId(body("trunkId"))
export const validUser = run((o, req) => {
    let token = jwt.decode(req.headers[X_ACCESS_TOKEN])
    if (!token || !token.user) {
        throw {code: "bf401"}
    }
    req.user = token.user
    req.user._id = object(req.user._id)
    return o
})


export const setUserIdIn = field => (o, req) => {
    o[field] = req.user._id
    return o
}

export const validQuantity = [
    grandeur(check("quantity.g")),
    number(check("quantity.bqt")),
]

export const validRepeted = check("repeted").exists().isBoolean().optional()

export const validFreq = [
    grandeur(check("freq.g")),
    number(check("freq.bqt")),
]
export const validDuree = [
    grandeur(check("duree.g")),
    number(check("duree.bqt")),
]
export const validOptionalName = check("name").optional().exists().isLength({max: 30})

export const validOwner = (col, field = "_id") => run(async (o, req) => {
    const doc = await col.findOne({_id: o[field]})
    if (doc) {
        if (req.user._id.equals(doc.oid)) {
            return o
        } else {
            throwErr("invalid owner", "bf403")
        }
    } else {
        throwErr("doc not found", "bf404")
    }
})

const throwErr = (name, code) => {
    const e = new Error(name)
    e.code = code
    throw e
}