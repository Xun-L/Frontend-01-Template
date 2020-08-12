import { parseHTML } from '../src/parser.js';
//const assert = require('assert');
import assert from 'assert';

it('parse a single element', function () {
  let doc = parseHTML('<dIv></div>');
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

it('parse a single element with text content', function () {
  let doc = parseHTML('<div>hello lx</div>');
  let text = doc.children[0].children[0];
  assert.equal(text.content, 'hello lx');
  assert.equal(text.type, 'text');
});

it('tag mismatch', function () {
  try {
    let doc = parseHTML('<div></xxxiv>');
  } catch (e) {
    assert.equal(e.message, "Tag start end doesn't match!");
  }
});

it('text with <', function () {
  let doc = parseHTML('<div>hello < lx</div>');
  let text = doc.children[0].children[0];
  assert.equal(text.content, 'hello < lx');
  assert.equal(text.type, 'text');
});

it('tag with attribute', function () {
  let doc = parseHTML('<div name="cc"  data    id = a class=\'c1\' >hello < lx</div>');
  let div = doc.children[0];
  assert.equal(div.attributes.find((n) => n.name === 'name').value, 'cc');
  assert.equal(div.attributes.find((n) => n.name === 'id').value, 'a');
  assert.equal(div.attributes.find((n) => n.name === 'class').value, 'c1');
});

it('selfClosingStartTag', function () {
  let doc = parseHTML('<div/>');
  let div = doc.children[0];
  for (let i of div.attributes) {
    if (i.name === 'isSelfClosing') {
      assert.equal(i.value, true);
      return
    }
  }
  assert.ok(false);
});



it('script', function () {
  let doc = parseHTML('<script><div>abcd</div><span>x</span><</s</sc</scr</scri</scrip</scrip</script</script >');
  let div = doc.children[0];
  let text = div.children[0]
  assert.equal(div.tagName, 'script');
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
 // assert.equal(text.content, '<div>abcd</div><span>x</span>/script></script');
});

it('selfClosingStartTag2', function () {
  let doc = parseHTML('<ddd id=2 class="3"data=1/>');
  let div = doc.children[0];
  assert.equal(div.attributes.find((n) => n.name === 'class').value, '3');
  for (let i of div.attributes) {
    if (i.name === 'isSelfClosing') {
      assert.equal(i.value, true);
      return
    }
  }

  assert.ok(false);
});
it('selfClosingStartTag2', function () {
  let doc = parseHTML('<ddd id=2 class="3"data="1"/>');
 
});

it('selfClosingStartTag3', function () {
  let doc = parseHTML('<ddd id/>');
  console.log(doc.children[0])
});
it('selfClosingStartTag3', function () {
  let doc = parseHTML('<ddd id></>');
  console.log(doc.children[0])
});
it('selfClosingStartTag66', function () {
  let doc = parseHTML('<div id="app"></div>');
  console.log(doc.children[0])
});
it('selfClosingStartTag66', function () {
  let doc = parseHTML('<div id=app></div>');
  console.log(doc.children[0])
});