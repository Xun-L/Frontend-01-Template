/*
 * @Description: KMP算法
 * @Date: 2020-04-27 11:04:28
 * @LastEditTime: 2020-05-22 18:05:07
 * @LastEditors: 李璕
 */
function generateNext(str) {
    let next = [-1];
    let k = -1;
    let j = 0;
    while (j < str.length - 1) {
        if (k == -1 || str[k] == str[j]) {
            k++;
            j++;
            next[j] = k
            // if (str[j] !== str[k]) {
            //     next[j] = k
            // } else {
            //     next[j] = next[k]
            // }


        } else {
            k = next[k]
        }
    }
    console.log(next)
    return next
}

function searchText(pattern, text) {
    let next = generateNext(pattern);
    console.log(next)
    let j = 0;
    for (let i = 0; i < text.length && j < pattern.length;) {
        if (j == -1 || pattern[j] == text[i]) {
            i++;
            j++;
        } else {
            j = next[j]
        }
    }
    console.log(j === pattern.length)
    return j === pattern.length
}

generateNext('abab')
//searchText('abab', 'abacacaabababababcc')
