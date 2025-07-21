module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@engine/(.*)$': '<rootDir>/../engine/src/$1',
  },
};
