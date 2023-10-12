module.exports = {
    title: {
        in: ['body'],
        isLength: {
            errorMessage: 'Title should be greater than 3 chars and less than 150 chars',
            options: { min: 3, max: 150 }
        },
        exists: true
    },
    technologiesUsed: {
        in: ['body'],
        errorMessage: 'technologiesUsed must be an array',
        optional: true
    },
    tagLine: {
        in: ['body'],
        isLength: {
            errorMessage: 'Tag line should be greater than 10 chars and less than 100 chars',
            options: { min: 10, max: 100 }
        },
        exists: true
    },
    story: {
        in: ['body'],
        isLength: {
            errorMessage: 'Story should be greater than 50 chars and less than 5000 chars',
            options: { min: 50, max: 5000 }
        },
        exists: true
    },
    githubLink: {
        in: ['body'],
        optional: true
    },
    catagory: {
        in: ['body'],
        errorMessage: '"catagory" field is missing',
        exists: true
    },
    teamMembers: {
        in: ['body'],
        errorMessage: 'teamMember must be an array',
        optional: true
    }
}
