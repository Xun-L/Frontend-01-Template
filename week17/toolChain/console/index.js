let ttys = require('ttys');
let readline = require('readline');



let stdin = ttys.stdin;
let stdout = ttys.stdout;

stdout.write('Hello world!\n');

stdout.write('\033[1A');

stdout.write('Xun-L\n');
