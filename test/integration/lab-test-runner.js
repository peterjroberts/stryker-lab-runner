const {
    TestStatus,
    RunStatus
} = require('stryker-api/test_runner');

const path = require('path');

const LabTestRunner = require('../../lib/lab-test-runner');

const Lab = require('lab');
const lab = exports.lab = Lab.script();

const {
    describe,
    it,
    beforeEach,
    before
} = lab;

const { expect } = require('code');

const countTests = (runResult, predicate) => runResult.tests.filter(predicate).length;

const countSucceeded = (runResult) => countTests(runResult, t => t.status === TestStatus.Success);

const countFailed = (runResult) => countTests(runResult, t => t.status === TestStatus.Failed);

const file = (filePath) => path.resolve(filePath);

describe('LabTestRunner', () => {

    let sut;

    describe('when tests pass', () => {

        beforeEach((done) => {
            const testRunnerOptions = {
                fileNames: [
                    file('./test-resources/sample-project/src/my-math.js'),
                    file('./test-resources/sample-project/test/my-math.js')
                ],
                strykerOptions: {
                    labOptions: {
                        files: ['**/*.js']
                    }
                },
                port: 1234
            };
            sut = new LabTestRunner(testRunnerOptions);

            done();
        });

        it('reports completed tests', () => {
            return sut.run()
                .then((runResult) => {
                    expect(countSucceeded(runResult)).to.equal(5);
                    expect(countFailed(runResult)).to.equal(0);
                    runResult.tests.forEach(t => expect(t.timeSpentMs).to.be.between(-1, 1000));
                    expect(runResult.status).to.equal(RunStatus.Complete);
                    expect(runResult.coverage).to.not.be.ok;
                });
        });

        it('should be able to run 2 times in a row', () => {
            return sut.run()
                .then(() => sut.run())
                .then((runResult) => {
                    expect(countSucceeded(runResult)).to.equal(5);
                });
        });
    });

    describe('with an error in an unincluded input file', () => {
        beforeEach((done) => {
            const options = {
                fileNames: [
                    file('test-resources/sample-project/src/my-math.js'),
                    file('test-resources/sample-project/src/error.js'),
                    file('test-resources/sample-project/test/my-math.js')
                ],
                strykerOptions: {
                    labOptions: {
                        files: ['**/my-math.js']
                    }
                },
                port: 1234
            };
            sut = new LabTestRunner(options);
            done();
        });

        it('reports completed tests without errors', () => {
            return sut.run()
                .then((runResult) => {
                    expect(runResult.status).to.equal(RunStatus.Complete);
                });
        });
    });

    describe('with multiple failed tests', () => {

        before((done) => {
            sut = new LabTestRunner({
                fileNames: [
                    file('test-resources/sample-project/src/my-math.js'),
                    file('test-resources/sample-project/test/my-math-failed.js')
                ],
                strykerOptions: {
                    labOptions: {
                        files: ['**/*.js']
                    }
                },
                port: 1234
            });
            done();
        });

        it('reports all failures', () => {
            return sut.run()
                .then((runResult) => {
                    expect(countFailed(runResult)).to.equal(2);
                });
        });
    });

});
