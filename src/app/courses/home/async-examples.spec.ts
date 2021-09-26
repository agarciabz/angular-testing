import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';

describe('Async Testing Examples', () => {
  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log('Running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('Asynchronous test example - setTimeout()', fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      console.log('Running assertions setTimeout()');
      test = true;
      expect(test).toBeTruthy();
    }, 1000);
    tick(1000); // or flush()
  }));

  fit('Asynchronous test example - plan Promise', fakeAsync(() => {
    let test = false;

    /**
     * Run and see order of logging.
     * Microtasks (Promise) run before tasks (setTimeout).
     */
    console.log('Creating promise');
    Promise.resolve().then(() => {
      console.log('Promise first then() evaluated successfully');
      test = true;
      return Promise.resolve();
    }).then(() => {
      console.log('Promise second then() evaluated successfully');
    });
    flushMicrotasks();
    console.log('Running test assertions');

    expect(test).toBeTruthy();
  }));
});
