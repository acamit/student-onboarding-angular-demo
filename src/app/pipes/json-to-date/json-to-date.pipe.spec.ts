import { JsonToDatePipe } from './json-to-date.pipe';

describe('JsonToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new JsonToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
