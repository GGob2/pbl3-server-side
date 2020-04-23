var mongoose = require('mongoose');
var ClassBasicInfo = require('./ClassBasicInfo')
var LectureNote = require('./LectureNote')
var QnA = require('./QnA');
var Course = require('./Course');
var LectureTime = require('./LectureTime');

const MIN_TUTEE = 2;

const ParticipationSchema = new mongoose.Schema({
    
});

const ClassSchema = new mongoose.Schema({
    //튜터 : User
    state: {
        type: String,
        enum: ['Waiting', 'InProgress', 'Ended']
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    //튜티
    tutees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    //강의 타입
    classType: {
        type: String,
        enum: ['RealtimeOnlineCourseType', 'OnlineCourseType', 'QnAType', 'OfflineType']
    },

    //카테고리 ex)컴퓨터공학
    category: {
        type: String,
        enum: ['컴퓨터공학', '수학', '영어']
    },

    //수업 ex)알고리즘
    studyAbout: String,

    //강의명 ex)알고리즘 쉽게 배워봐요~!!
    className: String,
    
    //수강 필요 포인트
    price: Number,

    //강의 생성일
    createdAt: {
        type: Date,
        default: Date.now
    },

    //--------------------------------------------------------------------------
    //강의실 홈에 보여질 내용 (성적인증, 소개글, 수업시간)
    basicInfo: ClassBasicInfo,
    //강의노트
    lectureNote: [LectureNote],
    //출결확인
    participation: ParticipationSchema,
    //질의응답
    qna: [QnA],

    // Not Required
    //스카이프 링크 - 커리큘럼 온라인 실시간
    skypeLink: String,
    //실시간 채팅방 - 질의응답형
    chattingRoom: String,
    //강의 링크 - 커리큘럼 온라인
    course:[Course],
    //수업시간
    lectureTime: [LectureTime],
    //수업에 참여할 수 있는 최대 튜티수
    maxTutee: Number
});
/*
    스키마 -> 모델 -> 다큐먼트
*/

/*
    Class 다큐먼트가 호출하는 메서드
*/
ClassSchema.methods.isJoinAllowed = function(){
    if(this.classType == 'OnlineCourseType'){
        if(this.state == 'InProgress'){
            return true;
        }else{
            return false;
        }
    }else{
        if(this.state == 'Waiting'){
            return true;
        }else{
            return false;
        }
    }

};

ClassSchema.methods.start = function(next){
    console.log(this)
    console.log(this.tutees.length)
    console.log(this.state)

    if(this.state == 'Waiting' && this.tutees.length >= MIN_TUTEE){
        this.state = 'InProgress'
        this.save(()=>{
            console.log(this._id + ' 강의시작');
            next(null);
        })
    }else{
        next('강의를 시작 할 수 없습니다.');
    }
};


/*
    Class 모델이 호출하는 메서드
*/
const DATA_TYPE = {
    'Course': ['RealtimeOnlineCourseType', 'OnlineCourseType', 'OfflineType'],
    'LectureTime': ['RealtimeOnlineCourseType', 'QnAType'],
    'MaxTutee': ['RealtimeOnlineCourseType', 'OfflineType'],
    'SkypeLink': ['RealtimeOnlineCourseType'],
}
ClassSchema.statics.addCourse = function(targetClassID, data, callback){
    this.findById(targetClassID, (err, found)=>{
        if(err){callback(err);return}

        if(DATA_TYPE['Course'].includes(found.classType)){
            //커리큘럼 추가.
            found.course.push(data);
            found.save(()=>{
                console.log('커리큘럼 추가성공')
            });
        }else{
            callback('이 클래스에는 커리큘럼을 추가 할 수 없습니다.');
        }
    })
};

ClassSchema.statics.addLectureTime = function(targetClassID, data, callback){
    this.findById(targetClassID, (err, found)=>{
        if(err){callback(err);return}

        if(DATA_TYPE['LectureTime'].includes(found.classType)){
            //강의시간 추가.
            found.lectureTime.push(data);
            found.save(()=>{
                console.log('강의시간 추가성공')
            });
        }else{
            callback('이 클래스에는 강의시간을 추가 할 수 없습니다.');
        }
    })
};

ClassSchema.statics.addMaxTutee = function(targetClassID, data, callback){
    this.findById(targetClassID, (err, found)=>{
        if(err){callback(err);return}

        if(DATA_TYPE['MaxTutee'].includes(found.classType)){
            //최대 튜티 수 추가.
            found.maxTutee = data;
            found.save(()=>{
                console.log('최대 튜티 수 추가성공')
            });
        }else{
            callback('이 클래스에는 최대 튜티 수를 설정 할 수 없습니다.');
        }
    })
};

ClassSchema.statics.addSkypeLink = function(targetClassID, data, callback){
    this.findById(targetClassID, (err, found)=>{
        if(err){callback(err);return}

        if(DATA_TYPE['SkypeLink'].includes(found.classType)){
            //스카이프링크 추가.
            found.skypeLink = data;
            found.save(()=>{
                console.log('스카이프링크 추가성공')
            });
        }else{
            callback('이 클래스에는 스카이프 링크를 설정 할 수 없습니다.');
        }
    })
};



const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;