import {validationResult} from "express-validator";

const failOnIssues = (req, res, next) => {
    const validationReport = validationResult(req)
    if (!validationReport.isEmpty()){
        console.log('something wrong with the input')
        res
            .status(400)
            .json(validationReport.array())
    } else {
        next()
    }
}

export default failOnIssues