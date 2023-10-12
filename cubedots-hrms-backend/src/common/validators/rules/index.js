const verifyEmail = require('./verify-email')
const signup = require('./signup')
const login = require('./login')
const resetPassword = require('./reset-password')

const changePassword = require('./change-password')
const applyLeave = require('./apply-leave')
const updateFamilyDeatils = require('./update-family-details')
const updateQulaficationDetails = require('./update-qualification-details')
const updateExperienceDetails = require('./update-experience-details')
const updatePersonalDetails= require('./update-personal-details')
const allocateLeaves= require('./allocate-leave')





module.exports = {
    verifyEmail,
    resetPassword,
    signup,
    login,
    changePassword,
    applyLeave,
    updateFamilyDeatils,
    updateQulaficationDetails,
    updateExperienceDetails,
    updatePersonalDetails,
    allocateLeaves
}
