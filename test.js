var mongoose = require('mongoose');
var Class = require('./Schemas/Class');
var User = require('./Schemas/User');

const test1 = {
    setStateToClass : function(){
        Class.find({}, (err, found)=>{
            console.log(found)
            for(let Class of found){
                if(!Class.state){
                    let state = 'Prepare'
                    if(Class.classType == 'OnlineCourseType'){
                        state = 'InProgress'
                    }
                    Class.state = state
                    Class.save(()=>{
                        console.log(Class.className + '저장완료')
                    })     
                }
            }
        })
    },
    increasePoint : function(uid, point){
        User.findById(uid, (err, found)=>{
            found.point = found.point + point
            found.save(()=>{
                console.log('포인트 증가 성공');
            })
        })
    },
    delete: async function(){
        const result = await Class.deleteMany({state : "Prepare"})
        console.log(result)
    },
    resetUser: function(){
        User.find(null, (err, found)=>{
            console.log(found)
            for(let user of found){
                user.classesAsTutor = []
                user.classesAsTutee = []
                user.save(()=>{
                    console.log('리셋성공')
                })
            }
           
        })
    }
}

module.exports = test1;