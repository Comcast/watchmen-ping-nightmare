const expect = require('expect');
const NightmarePingService = require('../index.js');
const mocksPath = './test/mocks'

describe('The Nightmare Ping Service', () => {
  let service;
  let pingService;

  beforeEach(done => {
    pingService = new NightmarePingService();
    service = {
      pingServiceOptions: {
        'nightmare': {
          scriptPath : {
            value: `${mocksPath}/nightmare-success.js`
          },
        },
      },
    };
    done();
  });

  it('should expose configuration options when queried', () => {
    var options = pingService.getDefaultOptions();
    expect(options).toIncludeKeys(['scriptPath']);
    expect(options.scriptPath.required).toBe(true);
  });

  it('should require a configuration to be present', (done) => {
    delete service.pingServiceOptions;
    pingService.ping(service, (err) => {
      expect(err).toExist();
      done();
    });
  });

  it('should require the scriptPath to be valid', (done) => {
    service.pingServiceOptions['nightmare'].scriptPath.value = './fake_file.js';
    pingService.ping(service, (err) => {
      expect(err).toExist();
      done();
    });
  });

  describe('with script execute success', () => {
    it('should exit without errors', (done) => {
      pingService = new NightmarePingService();
      pingService.ping(service, () => {
        done();
      });
    });
  });

  describe('with script execute failure', () => {
    beforeEach((done) => {
      service.pingServiceOptions['nightmare'].scriptPath.value = `${mocksPath}/nightmare-fail.js`;
      done();
    });

    it('should invoke the error callback to deal with unhandled errors', (done) => {
      pingService.ping(service, (err) => {
        expect(err).toExist();
        done();
      });
    });

    it('should invoke the error callback to deal with emitted errors', (done) => {
      service.pingServiceOptions['nightmare'].scriptPath.value = `${mocksPath}/nightmare-fail-complex.js`;
      pingService.ping(service, (err) => {
        expect(err).toExist();
      });
      done();
    });

    it('should summarize the error returned from nightmare', (done) => {
      pingService.ping(service, (err, body, response, time) => {
        expect(time).toNotBe(0);
        expect(err).toEqual('Error: I am an Error');
        done();
      });
    });
  });
});
