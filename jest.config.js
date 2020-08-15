module.exports = {
    collectCoverage: false,
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(meeussunmoon)/)'],
};
