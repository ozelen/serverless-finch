const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const { expect } = require('chai');

const validate = require('./validate');

describe('validate', () => {
  it('does not throw if passed valid config', () => {
    const sls = {
      config: { servicePath: 'foo' },
      utils: { dirExistsSync: () => true }
    };
    expect(() => validate(sls, { bucketName: 'my-bucket' })).not.to.throw();
  });

  it('throws if serverless.utils.dirExistsSync returns false', () => {
    const sls = {
      config: { servicePath: 'foo' },
      utils: { dirExistsSync: () => false }
    };
    expect(() => validate(sls, {})).to.throw();
  });

  describe('directory exists', () => {
    const sls = {
      config: { servicePath: 'foo' },
      utils: { dirExistsSync: () => true }
    };
    const bucketName = 'my-bucket';

    it('throws if bucketName is not set or is not a string', () => {
      expect(() => validate(sls, {})).to.throw();
      expect(() => validate(sls, { bucketName: { foo: 'bar' } })).to.throw();
      expect(() => validate(sls, { bucketName: 12 })).to.throw();
      expect(() => validate(sls, { bucketName })).not.to.throw();
    });

    it('throws if objectHeaders is not a map of headers with `name` and `value`', () => {
      let objectHeaders = 'foo';
      expect(() => validate(sls, { bucketName, objectHeaders })).to.throw();
      objectHeaders = { pattern: {} };
      expect(() => validate(sls, { bucketName, objectHeaders })).to.throw();
      objectHeaders = { pattern: [{ name: 'foo' }] };
      expect(() => validate(sls, { bucketName, objectHeaders })).to.throw();
      objectHeaders = { pattern: [{ value: 'bar' }] };
      expect(() => validate(sls, { bucketName, objectHeaders })).to.throw();
      objectHeaders = { pattern: [{ name: 'foo', value: 'bar' }] };
      expect(() => validate(sls, { bucketName, objectHeaders })).not.to.throw();
    });
  });
});