
export default err => {
    if (err.code === 11000) {
        err.status = 400
        err.body = {errorCode: 1, message: "allready exists"}
    } else if (err.code === 'bf403') {
        err.status = 403
        err.body = {errorCode: 3, message: "Réservé au propriétaire ou au super-utilisateur."}
    } else if (err.code === 'bf401') {
        err.status = 401
        err.body = {errorCode: 4, message: "Authentification requise."}
    } else if (err.code === 'bf404') {
        err.status = 404
        err.body = {errorCode: 4, message: "Introuvable."}
    }
}