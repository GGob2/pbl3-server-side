var mongoose = require('mongoose');
var ClassBasicInfo = require('./ClassBasicInfo')
var LectureNote = require('./LectureNote')
var QnA = require('./QnA');
var Course = require('./Course');

const ParticipationSchema = new mongoose.Schema({
    
});


const ClassSchema = new mongoose.Schema({
    //튜터 : User
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
    course:[Course]
});

ClassSchema.methods.getClassData = function(data){
    console.log('getClassData : ' + data);
    console.log(this);
};

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;