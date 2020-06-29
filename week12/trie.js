class Trie {
  constructor() {
    this.root = new Map();
  }
  insert(str) {
    let node = this.root;
    for (let code of str) {
      if (!node.has(code)) {
        node.set(code, new Map());
      }
      node = node.get(code);
    }
    if (node.has('count')) {
      node.set('count', node.get('count') + 1);
    } else {
      node.set('count', 1);
    }
  }
  most() {
    let maxLen = 0 ;
    let maxWord = "";

    let visit=(node,word)=>{
        if(node.has('count')&&node.get('count')>maxLen){
            maxLen = node.get('count');
            maxWord = word
        }
        for(let entry of node){
            if(entry[0]==='count'){
                continue;
            }
            visit(entry[1],word+entry[0])
        }
    }
    visit(this.root,"")
    return {
        maxLen,
        maxWord
    }

  }
}

function generateStr(length) {
  let word = '';
  for (let i = 0; i < length; i++) {
    word += String.fromCharCode(
      Math.floor(Math.random() * 26 + 'a'.charCodeAt(0))
    );
  }
  return word;
}

let trie = new Trie();
for (let i = 0; i < 1000000; i++) {
  trie.insert(generateStr(4));
}
