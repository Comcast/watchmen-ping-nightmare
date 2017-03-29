// This simulates a failed Nightmare execution with several errors
const EventEmitter = require('events');
const emitter = new EventEmitter();

for(let i = 0; i < 10; i++) {
  emitter.emit('error', new Error(`Mock emitted error ${i}`));
}

throw new Error('Mock uncaught Error');
