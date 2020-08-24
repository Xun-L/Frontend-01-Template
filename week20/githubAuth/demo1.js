

https://github.com/login/oauth/authorize?client_id=Iv1.a210cdcebcae98e3&state=lx22333

let xhr = new XMLHttpRequest();
let clientId = 'Iv1.a210cdcebcae98e3';
let state = 'lx22333'
let clientSecret = '3b1122d98fc8a55d6250f78d04120906ba4a4270'
let code = 'ac0fe9365926a7585390'

let params = `?client_id=${clientId}&state=${state}&client_secret=${clientSecret}&code=${code}`

xhr.open('POST',"https://github.com/login/oauth/access_token"+params)

xhr.onreadystatechange=(event)=>{
    if(xhr.status===200&&xhr.readyState===4){
        console.log(xhr.responseText)
    }
}
xhr.send()

let access_token='65eeeaa26663eaabb44ebaf67beda3bd930e2999'

let xhrUser = new XMLHttpRequest()
xhrUser.open("GET","https://api.github.com/user");
xhrUser.setRequestHeader('Authorization','token '+access_token)
xhrUser.onreadystatechange=(event)=>{
    if(xhrUser.status===200&&xhrUser.readyState===4){
        console.log(xhrUser.responseText)
    }
}
xhrUser.send()
