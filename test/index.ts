import { expect } from 'chai';
import { route }  from '../src/routes/index';

describe('index', function() {
  it('should be a function', function() {
    expect(route).to.be.a('function');
  });
});