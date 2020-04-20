module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  //preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/tests.js'],
  transform: {
    //'\\.(ts)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ["/node_modules/(?!(meeussunmoon)/)"]
};
