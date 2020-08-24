var page = require('webpage').create();
phantom.outputEncoding = 'gbk';
page.open('https://www.baidu.com/', function (status) {
    console.log('status:' + status);
    if (status === 'success') {
        var body = page.evaluate(function () {
            var toString = function (pad, ele) {
                var children = ele.childNodes;
                var childrenString = '';
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    childrenString += toString(' ' + pad, child) + '\n';
                }
                var name;
                if (ele.nodeType === Node.TEXT_NODE) {
                    name = '#text' + JSON.stringify(ele.textContent);
                }
                if (ele.nodeType === Node.ELEMENT_NODE) {
                    name = ele.tagName;
                }

                return (
                    pad + name + (childrenString ? '\n' + childrenString : '')
                );
            };
            return toString('', document.body);
        });
        console.log(body);
    }

    phantom.exit();
});
