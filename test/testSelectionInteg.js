import api from "../src"
import ENV from "../src/env"
import {init, withError, withTest} from "test-api-express-mongo"
import {createStringObjectId, createObjectId} from "test-api-express-mongo"
import {authGod, authSimple, god} from "./database/users"

describe('selection', function () {

    beforeEach(init(api, ENV, {SELECTION: ENV.DB_COLLECTION}))

    const selection = {
        _id: createObjectId(),
        trunkId: createObjectId(),
        quantity: {bqt: 7.5, g: "Mass"},
        repeted: true,
        freq: {bqt: 1, g: "Duré"},
        duree: {bqt: 10, g: "Duré"},
        name: "Manger du pain"
    }
    const selectionWithOwner = {...selection, oid: god._id}

    it('PUT selection bad auth', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            },
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            }
        },
        req: {
            url: `/api/selection`,
            method: "PUT",
            headers: authSimple,
            body: {
                ...selection,
                name: "other name!"
            }
        },
        res: {
            code: 403,
            bodypath: [
                {path: "errorCode", value: 3},
                {path: "message", value: "Réservé au propriétaire ou au super-utilisateur."}
            ]
        }
    }))

    it('PUT selection', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            },
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: {...selectionWithOwner, name: "other name!"}
            }
        },
        req: {
            url: `/api/selection`,
            method: "PUT",
            headers: authGod,
            body: {
                ...selection,
                name: "other name!"
            }
        },
        res: {
            body: {n: 1, nModified: 1, ok: 1}
        }
    }))

    it('POST selection', withTest({
        req: {
            url: "/api/selection",
            method: "POST",
            body: selection,
            headers: authGod
        },
        res: {
            body: {n: 1, ok: 1}
        },
        db: {
            expected: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            }
        }
    }))

    it('POST selection no auth', withTest({
        req: {
            url: "/api/selection",
            method: "POST",
            body: selection
        },
        res: {
            code: 401
        }
    }))

    it('POST bad selection', withTest({
        req: {
            url: "/api/selection",
            method: "POST",
            body: {},
            headers: authGod
        },
        res: {
            code: 400
        }
    }))

    it('GET selection by owner', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            }
        },
        req: {
            url: `/api/selection/owner/${selectionWithOwner.oid}`
        },
        res: {
            body: [
                selectionWithOwner
            ]
        }
    }))

    it('GET selection by _id', withTest({
        db: {
            preChange: {
                colname: ENV.DB_COLLECTION,
                doc: selectionWithOwner
            }
        },
        req: {
            url: `/api/selection/${selection._id}`
        },
        res: {
            body: selectionWithOwner
        }
    }))

})