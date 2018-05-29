//调用express包
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

//创建一个web server;
let app = express();

//设置express的view engine为hbs.
app.set('view engine', 'hbs');
//注册hbs的Partial,并且指定patials存放的绝对目录. __dirname前面的__是两个!!
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('UpperCase', (text) => {
    return text.toUpperCase();
});

//使用app.use定义middleware,进行服务器日志的记录.
app.use((req, res, next)=>{
    let log = {
        time : new Date(),
        url : req.url,
        method : req.method
    };
    //反斜杠n 这个需要使用 es6的 Input template.
    //fs.appendFile必须有发生错误的callback函数, 不然就会报错.
    fs.appendFile('server.log', JSON.stringify(log) +`\n`, (err) =>{
        if(err){
            console.log(`Error: Cannot save log in server.log`);
        }
    } );
    next();
});
//服务器处于维护状态, 展示maintance page的内容,其他页面通过不写 next();的方式全部阻拦.
//app.use接受一个函数作为参数, 这个函数可以包含三个参数(req, res, next)都是express预制好的.
//req 用来获取访问者的相关信息, res用来提供服务器返回的信息, next用来控制是否让进行往下进行.
//无论访问哪一个页面, 最终都会只看到maintance.hbs的页面
// app.use((req, res, next) => {
//     res.render('maintance.hbs', {
//         titleName : 'Website Maintance',
//         paragraphContent : 'We are maintance now, please visit later'
//     });
//     // next();
// });

app.get('/', (req, res) => {
    res.render('home.hbs',{
        titleName : 'Home Page',
        headerName : 'This is home page',
        paragraphContent : 'The paragraph is about home page'
    });
});
//使用hbs view Engine 配合app.get去展示内容给访问者.
//当用户访问/help页面的时候, 所展示的内容.
//注意, 必须是/help, 不可以是help.html. 因为这个不是html页面.
app.get('/help', (req, res) =>{
    // 当使用app.set设置好express的view engien为hbs之后, 我们需要通过res.render去返回数据给template页面.
    //res.render接受两个参数. 第一个参数就是views文件夹中的hbs文件名的字符串(不可以加“/”). 第二个参数就是一个对象,包含template页面将会调用的属性和值.
    //只有使用res.render的时候, 才会渲染hbs页面的内容. 
    res.render('help.hbs',{
        //三个属性和值,在template页面当中使用{{属性名称}}, 即可在hbs渲染的时候输出对应的值.
        titleName : 'Help Page',
        headerName : 'This is help page',
        paragraphContent : 'The paragraph is about help page'
    })
});
app.get('/readme', (req, res) => {
    res.render('readme.hbs', {
        titleName : 'Read Me',
        headerName : 'This is Read Me Page',
        paragraphContent : 'This is a simple nodejs server project with express.js'
    })
})

//使用监听端口,去对所有来访的访问者进行侦测. 本地浏览器打开的地址就是 localhost:3000; 
//使用监听端口之后, 除非我们手动关闭服务器, 否则程序会一直处于监听状态.
//app.listen 将会绑定一个机器上的端口.
//app.listen的第二个参数是一个可选参数,这个参数将会被调用当服务器的监听开启的时候, 也就是服务器启动的时候.
app.listen(port, () => {
    console.log(`Server is turn on on the ${port} port`)
});