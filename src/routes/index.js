/**
 * Created by Kevin on 18/8/2016.
 */
const Router = require('koa-router');
const co = require('co');

const mainRouter = new Router();


mainRouter.get('/', co.wrap(function*(ctx, next){
    yield ctx.render('index', {content: 'Hello World!123123', fba: 1234});
}));

mainRouter.get('/school', co.wrap(function*(ctx, next){
    let mysql = require('mysql');
    let action = ctx.query.action;
    let operation = ctx.query.operation;
    let name = ctx.query.name;
    let grade = ctx.query.grade;
    let newClass = ctx.query.class;
    let age = ctx.query.age;
    let sex = ctx.query.sex;
    let chinese = ctx.query.chinese;
    let math = ctx.query.math;
    let english = ctx.query.english;
    let id = ctx.query.id;
    let course = ctx.query.course;
    let user = ctx.query.user;
    let password = ctx.query.password;

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'school'
    });
    connection.connect();
    if(action == 'login'){
        if(operation == 'enter'){
            yield(function(cb){
                connection.query(`SELECT * FROM user`,function(err,admin){
                if(err){
                    throw err;
                }else{
                    for(let a = 0; a < admin.length; a++){
                        if(admin[a].permissions != 0){
                            console.log('asd');
                        }else{
                            console.log('asdasdas');
                        }
                    }
                }
                cb(err,admin);
                });
                connection.end();
            });
        }
        // yield(function(cb){
        //         connection.query(`SELECT * FROM user`,function(err,admin){
        //         if(err){
        //             throw err;
        //         }else{
        //             for(let i = 0; i < admin.length; i++){
        //                 if(user == admin[i].user && password == admin[i].password){
        //                     if(admin[i].permissions == 0){
        //                         ctx.response.redirect('/school?action=principal&operation=list');
        //                     }else if(admin[i].permissions == 1){
        //                         ctx.response.redirect('/school?action=teacher&operation=list');
        //                     }else if(admin[i].permissions == 2){
        //                         ctx.response.redirect('/school?action=student&operation=list');
        //                     }
        //                 }else{
        //                     ctx.body = '用户名或密码不正确，请确认！';
        //                 }
        //             }
        //         }
        //         cb(err,admin);
        //         });
        //         connection.end();
        //     });
    }else if(action == 'teacher'){
        if(operation == 'list'){
            yield(function(cb){
                connection.query(`SELECT *, ROUND((chinese+math+english)/3,1) AS average,chinese+math+english AS total FROM student`,function(err,list){
                if(err){
                    throw err;
                }else{
                    let str = '';
                    for(let i = 0; i < list.length; i++){
                        str += `学号：${list[i].id}\n年级：${list[i].grade}\n班级：${list[i].class}\n姓名：${list[i].name}\n年龄：${list[i].age}\n性别：${list[i].sex}\n语文成绩：${list[i].chinese}\n数学成绩：${list[i].math}\n英语成绩：${list[i].english}\n平均分：${list[i].average}\n总分：${list[i].total}\n\n\n`;
                    }
                    ctx.body = str;
                }
                cb(err,list);
                });
                connection.end();
            });
        }else if(operation == 'info'){
            if(name != null){
                yield(function(cb){
                    connection.query(`SELECT *,ROUND((chinese+math+english)/3,1) AS average,chinese+math+english AS total FROM student WHERE name = '${name}'`,function(err,info){
                    if(err){
                        throw err;
                    }else{
                        console.log(info);
                        let str = `查询出来的学生资料有${info.length}条\n\n`;
                        for(let i = 0; i < info.length; i++){
                            str += `学号：${info[i].id}\n年级：${info[i].grade}\n班级：${info[i].class}\n姓名：${info[i].name}\n年龄：${info[i].age}\n性别：${info[i].sex}\n语文成绩：${info[i].chinese}\n数学成绩：${info[i].math}\n英语成绩：${info[i].english}\n平均分：${info[i].average}\n总分：${info[i].total}\n\n\n`;
                        }
                        ctx.body = str;
                    }
                    cb(err,info);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请输入要查询的学生名字！';
            }
        }else if(operation == 'add'){
            if(name == null || grade == null || newClass == null || age == null || sex == null || chinese == null || math == null || english == null){
                ctx.body = '请仔细完善要添加的学生资料！';
            }else{
                yield(function(cb){
                    connection.query(`INSERT INTO student SET grade='${grade}',class='${newClass}',name='${name}',age='${age}',sex='${sex}',chinese='${chinese}',math='${math}',english='${english}'`,function(err,add){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `学生：${name}\n添加成功！`;
                    }
                    cb(err,add);
                    });
                    connection.end();
                });
            }
        }else if(operation == 'update'){
            if(id != null || name != null || grade != null || newClass != null || age != null || sex != null || chinese != null || math != null || english != null){
                yield(function(cb){
                    connection.query(`UPDATE student SET name = '${name}',grade='${grade}',class='${newClass}',sex='${sex}',chinese='${chinese}',math='${math}',english='${english}' WHERE id='${id}'`,function(err,update){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `学生：${name}\n修改成功！`;
                    }
                    cb(err,update);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请仔细完善要更新的资料（根据学号修改）';
            }
        }else if(operation == 'delete'){
            if(id != null){
                yield(function(cb){
                    connection.query(`DELETE FROM student WHERE id='${id}'`,function(err,del){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `学生：${name}\n删除成功！`;
                    }
                    cb(err,del);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请输入要删除学生的学号';
            }
        }else{
            ctx.body = '请输入要进行的操作！'
        }
    }else if(action == 'principal'){
        if(operation == 'list'){
            yield(function(cb){
                connection.query(`SELECT * FROM teacher`,function(err,list){
                if(err){
                    throw err;
                }else{
                    let str = '';
                    for(let i = 0; i < list.length; i++){
                        str += `编号：${list[i].id}\n姓名：${list[i].name}\n年龄：${list[i].age}\n性别：${list[i].sex}\n所教课程：${list[i].course}\n\n`;
                    }
                    ctx.body = str;
                }
                cb(err,list);
                });
                connection.end();
            });
        }else if(operation == 'info'){
            if(name != null){
                yield(function(cb){
                    connection.query(`SELECT * FROM teacher WHERE name='${name}'`,function(err,info){
                    if(err){
                        throw err;
                    }else{
                        console.log(info);
                        let str = `查询出来的教师资料有${info.length}条\n\n`;
                        for(let i = 0; i < info.length; i++){
                            str += `编号：${info[i].id}\n姓名：${info[i].name}\n年龄：${info[i].age}\n性别：${info[i].sex}\n所教课程：${info[i].course}\n\n`;
                        }
                        ctx.body = str;
                    }
                    cb(err,info);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请输入要查询的教师名字！';
            }
        }else if(operation == 'add'){
            if(name == null || age == null || sex == null || course == null){
                ctx.body = '请仔细完善要添加的教师资料！';
            }else{
                yield(function(cb){
                    connection.query(`INSERT INTO teacher SET name='${name}',age='${age}',sex='${sex}',course='${course}'`,function(err,add){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `教师：${name}\n添加成功！`;
                    }
                    cb(err,add);
                    });
                    connection.end();
                });
            }
        }else if(operation == 'update'){
            if(id != null || name != null || age != null || sex != null || course != null){
                yield(function(cb){
                    connection.query(`UPDATE teacher SET name='${name}',age='${age}',sex='${sex}',course='${course}' WHERE id='${id}'`,function(err,update){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `教师：${name}\n修改成功！`;
                    }
                    cb(err,update);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请根据教师编号进行资料的修改，以避免重复';
            }
        }else if(operation == 'delete'){
            if(id != null){
                yield(function(cb){
                    connection.query(`DELETE FROM teacher WHERE id='${id}'`,function(err,del){
                    if(err){
                        throw err;
                    }else{
                        ctx.body = `删除成功！`;
                    }
                    cb(err,del);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请输入要删除教师的编号';
            }
        }else{
            ctx.body = '请输入要进行的操作！'
        }
    }else if(action == 'student'){
        if(operation == 'list'){
            yield(function(cb){
                connection.query(`SELECT *, ROUND((chinese+math+english)/3,1) AS average,chinese+math+english AS total FROM student`,function(err,list){
                if(err){
                    throw err;
                }else{
                    let str = '';
                    for(let i = 0; i < list.length; i++){
                        str += `学号：${list[i].id}\n年级：${list[i].grade}\n班级：${list[i].class}\n姓名：${list[i].name}\n年龄：${list[i].age}\n性别：${list[i].sex}\n语文成绩：${list[i].chinese}\n数学成绩：${list[i].math}\n英语成绩：${list[i].english}\n平均分：${list[i].average}\n总分：${list[i].total}\n\n\n`;
                    }
                    ctx.body = str;
                }
                cb(err,list);
                });
                connection.end();
            });
        }else if(operation == 'info'){
            if(name != null){
                yield(function(cb){
                    connection.query(`SELECT *,ROUND((chinese+math+english)/3,1) AS average,chinese+math+english AS total FROM student WHERE name = '${name}'`,function(err,info){
                    if(err){
                        throw err;
                    }else{
                        console.log(info);
                        let str = `查询出来的学生资料有${info.length}条\n\n`;
                        for(let i = 0; i < info.length; i++){
                            str += `学号：${info[i].id}\n年级：${info[i].grade}\n班级：${info[i].class}\n姓名：${info[i].name}\n年龄：${info[i].age}\n性别：${info[i].sex}\n语文成绩：${info[i].chinese}\n数学成绩：${info[i].math}\n英语成绩：${info[i].english}\n平均分：${info[i].average}\n总分：${info[i].total}\n\n\n`;
                        }
                        ctx.body = str;
                    }
                    cb(err,info);
                    });
                    connection.end();
                });
            }else{
                ctx.body = '请输入要查询的学生名字！';
            }
        }else{
            ctx.body = '学生只允许查询！';
        }
    }else{
        ctx.body = '请在action出写明是学生或老师或校长！';
    }
    
    /* 
        SELECT * FROM user 
        INSERT INTO user SET name = 'AA', age = 10
        UPDATE user SET name = 'NewName' WHERE name = 'Kevin'
        DELETE FROM user WHERE name = 'AA'
    */

    //let sql = 'SELECT * FROM user'
    // let name = 'Kevin'
    // let sql = `SELECT * FROM user name = '${name}'`;
    // connection.query(sql, function(err, rows, fileds){

    // })

    // sql = 'SELECT * FROM user name = ? AND age = ?'
    // connection.query(sql, [name, 18], function(err, result){

    // })
    // yield (function(cb){
    //     connection.query('SELECT * FROM user', function(err, rows) {
    //         if(err){
    //             console.log('Error');
    //         }else{
                
    //         }
    //         cb(err)
    //     });
    //     connection.end();
    // })
    
}));




// mainRouter.get('/file',co.wrap(function*(ctx,next){
//     let file = fs.readFileSync('IBCollectionItemView.m','utf-8');
//     let arr = file.split('\n');
//     let action = ctx.query.action;
//     let text = ctx.query.text;
//     let New = ctx.query.new;
//     if(action == 'query'){
//         let newArr = [];
//         let str1 = '';
//         let str2 = '分别在:\n'
//         for(let i = 0; i < arr.length; i++){
//             if(arr[i].indexOf(text) > -1){
//                 let index = -1;
//                 do{
//                     index = arr[i].indexOf(text, index + 1);
//                     if(index != -1){
//                         newArr.push(text);
//                         str2 += `第${i+1}行 位置${index+1}开始\n`
//                     }
//                 }while(index != -1);
//             }
//         }
//         str1 += `${text} 出现 ${newArr.length} 次\n`;
//         ctx.body = str1 + str2;
//     }else if(action == 'replace'){
//         let newArr1 = [];
//         let str = '';
//         var reg = new RegExp(text,'g');
//         var newStr1 = file.replace(reg,New);
//         fs.writeFileSync('IBCollectionItemView_New.m',newStr1);
//         for(let i = 0; i < arr.length; i++){
//             if(arr[i].indexOf(text) > -1){
//                 let index = -1;
//                 do{
//                     index = arr[i].indexOf(text, index + 1);
//                     if(index != -1){
//                         newArr1.push(text);
//                     }
//                 }while(index != -1);
//             }
//         }
//         console.log(newStr1);
//         str += `替换 ${text} ${newArr1.length}处`;
//         ctx.body = str;
//     }
// }));




// if(action == 'list'){
//         yield(function(cb){
//             connection.query(`SELECT * FROM persons`,function(err,list){
//                 if(err){
//                     throw err;
//                 }else{
//                     let str = `总共 ${list.length} 条数据：\n`;
//                     for(let i = 0; i < list.length; i++){
//                        str += `用户名：${list[i].name} 电话号码：${list[i].phone}\n`;
//                     }
//                     ctx.body = str;
//                 }
//                 cb(err,list);
//             });
//             connection.end();
//         });
//     }else if(action == 'info'){
//         yield(function(cb){
//             connection.query(`SELECT * FROM persons WHERE name='${name}'`,function(err,info){
//                 if(err){
//                     throw err;
//                 }else{
//                     if(name == info[0].name){
//                         ctx.body = `查询结果：\n用户名：${info[0].name}\n手机号码：${info[0].phone}`;
//                     }else{
//                         ctx.body = '查无此数据，请重新查询！';
//                     }
//                 }
//                 cb(err,info);
//             });
//             connection.end();
//         });
//     }else if(action == 'add'){
//             if(name == null || phone == null){
//                 ctx.body = `请输入要添加的姓名或电话！`;
//             }else{
//                 yield(function(cb){
//                     connection.query(`INSERT INTO persons SET name='${name}',phone='${phone}'`,function(err,add){
//                         if(err){
//                             throw err;
//                         }else{
//                             ctx.body = `用户名：${name}\n添加成功！`;
//                         }
//                         cb(err,add);
//                     });
//                     connection.end();
//                 });
//             }
//     }else if(action == 'update'){
//         if(name == null || phone == null){
//             ctx.body = '请输入要修改的姓名和电话！';
//         }else{
//             yield (function(cb){
//                 connection.query(`UPDATE persons SET phone = '${phone}' WHERE name='${name}'`,function(err,update){
//                     if(err){
//                         throw err;
//                     }else{
//                         ctx.body = `用户名：${name}\n修改成功！`;
//                     }
//                     cb(err,update);
//                 });
//                 connection.end();
//             });
//         }
//     }else if(action == 'delete'){
//         if(name == null){
//             ctx.body = '请输入要删除的姓名！';
//         }else{
//             yield(function(cb){
//                     connection.query(`DELETE FROM persons WHERE name = '${name}'`,function(err,del){
//                         if(err){
//                             throw err;
//                         }else{
//                             ctx.body = `用户名：${name}\n删除成功！`;
//                         }
//                         cb(err,del);
//                     });
//                     connection.end();
//                 });
//         }
//     }else{
//         ctx.body = '错误！请查看您的URL地址是否输入有误！';
//     }

// mainRouter.get('/user',co.wrap(function*(ctx,next){
//     let action = ctx.query.action;
//     let name = ctx.query.name;
//     let phone = ctx.query.phone;
//     function list(){
//         let newStr = '列表：\n';
//         for(let a = 0; a < persons.length; a++){
//             newStr += `${(a+1)}.name:${persons[a].name}  Phone:${persons[a].phone}\n`;
//         }
//         return newStr;
//     };

//     if(action == 'list'){
//         ctx.body = `总共${persons.length}条数据\n${list()}`;
//     }else if(action == 'info'){
//         let newSay1 = '';
//         for(var a = 0; a < persons.length; a++){
//             if(name == persons[a].name){
//                 newSay1 += `查询结果：\n用户名：${persons[a].name}\n手机号码：${persons[a].phone}\n\n`;
//             }
//         }
//         ctx.body = newSay1+list();
//     }else if(action == 'add'){
//         let newSay2 = `用户名：${name}\n添加成功\n\n`;
//         persons.push(
//             {
//                 name:name,
//                 phone:phone
//             }
//         );
//         ctx.body = newSay2+list();
//     }else if(action == 'delete'){
//         for(let a = 0; a < persons.length; a++){
//                 if(name == persons[a].name){
//                     persons.splice(a,1);
//                     a--;
//                 }
//             }
//         ctx.body = list();
//     }else{
//         ctx.body = '错误！请确认您的URL地址是否输入有误！';
//     }







// var persons = {
//     kevin: {
//         name: 'Kevin',
//         phone: '13632672159'
//     },
//     abc: {
//         name: 'ABC',
//         phone: '1321'
//     }
// }
//     //查询全部数据
//     if(action == 'list'){
//         let newStr = '';
//         for(let i in persons){
//             newStr += `用户名: ${persons[i].name} 电话号码: ${persons[i].phone}\n`;
//         }
//         ctx.body = `总共${Object.keys(persons).length}条数据\n\n${newStr}`;
//     }else if(action == 'info'){//查询某一条数据
//         let tmpKey = name.toLowerCase();
//         ctx.body = `查询结果：\n用户名：${persons[tmpKey].name}\n手机号码：${persons[tmpKey].phone}`;
//     }else if(action == 'add'){//添加数据
//         if(name in persons){
//             ctx.body = '用户名以存在，请重新输入！'
//         }else{
//             let tmpKey = name.toLowerCase();//toLowerCase()方法用于把字符串转为小写，toUpperCase() 方法用于把字符串转换为大写。
//             let tmpObject = {
//                 name: name,
//                 phone: phone
//             }
//             persons[tmpKey] = tmpObject;
//             ctx.body = `用户名：${tmpKey}\n添加成功!`;
//             console.log(persons);
//         }
//     }else if(action == 'update'){//更新数据
//             if(name in persons){
//                 let tmpKey = name.toLowerCase();
//                 let tmpObject = {
//                     name: name,
//                     phone: phone
//                 }
//                 persons[tmpKey] = tmpObject;
//                 ctx.body = `用户名：${tmpKey}\n更新成功！`;
//                 console.log(persons);
//             }else{
//                 ctx.body = '查询无结果，请重新输入要更新的数据！'
//             }
//     }else if(action == 'delete'){//删除数据
//         if(name in persons){
//             let tmpKey = name.toLowerCase();
//             delete persons[tmpKey];
//             ctx.body = `用户名：${tmpKey}\n删除成功！`;
//         }else{
//             ctx.body = '查询无结果，请重新输入要删除的数据！';
//         }
//     }else{
//         ctx.body = '错误！请确认您的URL地址是否输入有误！'
//     }
//  }));













// var readFile = function(name,age){
//     ctx.body = `woshi ${name}, jinnian:${age}`
//     return `我是${name},今年${age}岁`;
// }
// var forEachValue = function(values) {
//     var tmpValue = values.split(',');//把url地址里面values的值以 ，分割成一个数组返回出来
//     console.log(tmpValue);//打印分割好的数组
//     let arr = [];//新建一个数组用来存储循环后的数据
//     let a = ''//新建一个空字符串用来存储循环的数据
//     for(let i = 0; i < tmpValue.length; i++) {
//         a = '第' + (i+1) +'个参数的值为:'//i+1加括号是为了设置优先级
//         let result = a + tmpValue[i] + "*" + (i+1) + "=" + tmpValue[i] * (i + 1)
//         arr.push(result);//将运算好的参数添加到arr数组里面
//     }
//      console.log(arr);
//     return arr;//返回arr数组出去以便调用
// }


// let eachArr =  function(newValues, content){
//     var arr = newValues.split('|');//把url地址里的values的值以 | 分割并返回一个数组
//     var tmp = '';
//     var count = 0;
//     var newArr = [];
//     for(let i = 0; i < arr.length; i++) {
//         // console.log(arr[i]);
//         tmp = arr[i];//遍历arr数组并把arr数组里的元素传入新建的tmp字符串里面
//         // if(tmp == arr[i+1]) {}
//         if(arr[i] != "nima") {//第一次是肯定不等于'nima'
//             for(let j = 0; j < arr.length; j++) {//再次遍历arr数组
//                 if(tmp == arr[j]) {
//                     count ++;//如果tmp里的元素与arr数组里的参数相同的话，次数count自加一次，也就是0+1=1，以此类推
//                     arr[j] = 'nima';//将数组里的这个值等于'nima'，以便不参与下次循环
//                 }
//             }
//             newArr.push('数据 ' + tmp + ' 出现了 ' + count + ' 次');//将循环好的数据添加进newArr数组里面，准备返回出去，以便调用
//             count = 0;//将count的值重新归0以便下次循环计算
//         }
//     }
//     let newStr;
//     let vuleB = 'b';
//     let countB = 0;
//     newStr = newValues.replace(/1/g, content)//正则 不懂  大概意思：将1替换成了我想要的数据
//     console.log(newStr)
//     for(let i = 0; i < newStr.length; i ++) {
//         console.log(newStr[i])
//         if(newStr[i].toLowerCase() == vuleB.toLowerCase()) {
//             countB++;
//         }
//     }

//         return {newArr: newArr, newStr: newStr, countB: 'B出现了' + countB};
// }


// mainRouter.get('/demo1', co.wrap(function*(ctx, next){
//     let name = ctx.query.name;
//     let age = parseInt(ctx.query.age);
//     let content = readFile(name,age);
//     ctx.body = content;
  
// }));
// mainRouter.get('/demo2', co.wrap(function*(ctx, next){
//     let values = ctx.query.values;//获取url里面query的values的值
//     // let valuesArr = values.split(',');  //split用于把字符串分割成数组
//     let valuesArr = forEachValue(values);//调用forEachValue函数
//     // let result = valuesArr.join('||||||-------\n');
//     let result = '';
//     for(let i = 0; i < valuesArr.length; i++) {//遍历forEachValue函数里面arr数组返回出来的数据
//         result += valuesArr[i] + '\n';//将值赋给result字符串
//     }
//     console.log(valuesArr);
//      ctx.body = result;//并打印到网页上
// }));

// mainRouter.get('/demo3',co.wrap(function*(ctx,next){
    // let newValues = ctx.query.values;
    // let content = ctx.query.content;
    // console.log(newValues);
    // let agg = eachArr(newValues, content);
    // let newResult = '';
    // console.log(agg)
    // for(let i = 0; i < agg.newArr.length; i++){
    //     newResult += agg.newArr[i] + '\n';
    // }
    // console.log(agg);
    // ctx.body = newResult + "\n" + agg.newStr + "\n" + agg.countB;




//     let tmpValues = ctx.query.values.split('|');
//     let result = {};
//     for (let tmp of tmpValues){
//         let count = result[tmp];
//         console.log(count);
//         //查找有没有这个值，如果后面有这个值就加1，没有就等于1
//         if (!count){
//             result[tmp] = 1;
//         }else {
//             count += 1;
//             result[tmp] = count;
//         }
//     }
//     console.log(result);
//     ctx.body = '';
//     let allKeys = Object.keys(result);
//     console.log(allKeys);
//     for (let key of allKeys){
//         ctx.body += `${key} chuxiang: ${result[key]} \n`;
//     }

// }));











// mainRouter.get('/login', co.wrap(function*(ctx, next){

//     if (ctx.query.user == 'kevin' && ctx.query.password == '123456'){
//         ctx.body = {code: 0, message: '成功'};
//     }else {
//         ctx.body = {code: 0, message: '失败'};
//     };
//     yield next();
// }));




// mainRouter.get('/order/list', co.wrap(function*(ctx, next){
//     let page = parseInt(ctx.query.page);
//     if (page == 1){
//         ctx.body = "这是第一页"
//     }else if (page == 2){
//         ctx.body = {code: 0, data: [1, 2, 3]}
//     }else {
//         ctx.body = "不支持";
//     }
// }));

// mainRouter.get('/test2', co.wrap(function*(ctx, next){
//     ctx.body = '123';
// }));

// mainRouter.get('/info', co.wrap(function*(ctx, next){
//     ctx.body = {code: 0, data: [1, 2, 3]};
//     yield next();
// }));

module.exports = [mainRouter.routes()];