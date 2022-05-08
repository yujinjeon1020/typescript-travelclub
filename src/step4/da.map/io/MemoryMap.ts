import TravelClub from "../../../step1/entity/club/TravelClub";
import CommunityMember from "../../../step1/entity/club/CommunityMember";
import SocialBoard from "../../../step1/entity/board/SocialBoard";
import Posting from "../../../step1/entity/board/Posting";
import Comment from "../../../step1/entity/board/Comment";

class MemoryMap {

    //싱글톤으로 만드는 이유? - 만약 DB가 존재할 때 Board 테이블이 한개여야만 하지 두개 이상이면,..? DB가 어디에 저장될지 모름,,
    //club, board, member 등,, 테이블은 하나씩 있어야 하니까!
    private static uniqueInstance: MemoryMap;

    clubMap: Map<string, TravelClub>;
    memberMap: Map<string, CommunityMember>;
    boardMap: Map<string, SocialBoard>;
    postingMap: Map<string, Posting>;
    commentMap: Map<string, Comment>;
    autoIdMap: Map<string, number>;

    private constructor() {
        this.clubMap = new Map<string, TravelClub>();
        this.memberMap = new Map<string, CommunityMember>();
        this.boardMap = new Map<string, SocialBoard>();
        this.postingMap = new Map<string, Posting>();
        this.commentMap = new Map<string, Comment>();
        this.autoIdMap = new Map<string, number>();
    }

    //이 메소드를 이용해야만 생성자로 생성 가능 (생성자가 private 이므로 생성자에 직접 접근X)
    static getInstance(): MemoryMap {
        if (this.uniqueInstance === undefined) {
            this.uniqueInstance = new MemoryMap();
        }
        return this.uniqueInstance;
    }
}

export default MemoryMap;