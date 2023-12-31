const {
    checkSchema,
    validationResult
} = require('express-validator')
const rules = require('./rules')

const prepareCustomErrorMessage = (errors) => {
    const errorDetails = errors.map(({ param, msg }) => {
        return { param, msg }
    })
    return {
        name: 'ValidationError',
        status: 422,
        message: errorDetails
    }
}

const validate = async (req, res, next) => {
    const errorResult = validationResult(req).array()
    if (errorResult.length > 0) {
        const errors = prepareCustomErrorMessage(errorResult)
        res.status(422).send({ errors })
    } else {
        next()
    }
}

const validateSignup = [checkSchema(rules.signup), validate]
const validateLogin = [checkSchema(rules.login), validate]
const validateVerifyEmail = [checkSchema(rules.verifyEmail), validate]
const validateResetPass = [checkSchema(rules.resetPassword), validate]
const validateChangePassword = [checkSchema(rules.changePassword), validate]
const validateApplyleave = [checkSchema(rules.applyLeave), validate]
const validateUpdateFamilyDetails = [checkSchema(rules.updateFamilyDeatils), validate]
const validateExperienceDetails= [checkSchema(rules.updateExperienceDetails), validate]
const validateQulaficationDetails = [checkSchema(rules.updateQulaficationDetails), validate]
const validatePersonalDetails = [checkSchema(rules.updatePersonalDetails), validate]
const validateAllocateLeaves = [checkSchema(rules.allocateLeaves), validate]





module.exports = {
    validateSignup,
    validateLogin,
    validateVerifyEmail,
    validateResetPass,
    validateChangePassword,
    validateApplyleave,
    validateUpdateFamilyDetails,
    validateQulaficationDetails,
    validateExperienceDetails,
    validatePersonalDetails,
    validateAllocateLeaves
}
