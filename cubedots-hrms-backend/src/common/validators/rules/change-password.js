module.exports = {
    currentPassword: {
        in: ['body'],
        errorMessage: '"currentPassword" field is missing',
        exists: true
    },
    newPassword: {
        in: ['body'],
        errorMessage: '"newPassword" field is missing',
        exists: true,
    },
}
