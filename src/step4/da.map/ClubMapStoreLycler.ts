import ClubStoreLycler from "../store/ClubStoreLycler";
import ClubStore from "../store/ClubStore";
import MemberStore from "../store/MemberStore";
import BoardStore from "../store/BoardStore";
import PostingStore from "../store/PostingStore";
import CommentStore from "../store/CommentStore";
import MemberMapStore from "./MemberMapStore";
import ClubMapStore from "./ClubMapStore";
import BoardMapStore from "./BoardMapStore";
import Posting from "../../step1/entity/board/Posting";
import PostingMapStore from "./PostingMapStore";
import CommentMapStore from "./CommentMapStore";

class ClubMapStoreLycler implements ClubStoreLycler {

    //싱글톤
    private static lycler: ClubStoreLycler;

    clubStore: ClubStore | null;
    memberStore: MemberStore | null;
    boardStore: BoardStore | null;
    postingStore: PostingStore | null;
    commentStore: CommentStore | null;

    private constructor() {
        this.clubStore = null;
        this.memberStore = null;
        this.boardStore = null;
        this.postingStore = null;
        this.commentStore = null;
    }

    static getInstance(): ClubStoreLycler {
        if (!this.lycler) {
            this.lycler = new ClubMapStoreLycler();
        }
        return this.lycler;
    }

    requestMemberStore(): MemberStore {
        if (!this.memberStore) {
            this.memberStore = new MemberMapStore();
        }
        return this.memberStore;
    }

    requestClubStore(): ClubStore {
        if (!this.clubStore) {
            this.clubStore = new ClubMapStore();
        }
        return this.clubStore;
    }

    requestBoardStore(): BoardStore {
        if (!this.boardStore) {
            this.boardStore = new BoardMapStore();
        }
        return this.boardStore;
    }

    requestPostingStore(): PostingStore {
        if (!this.postingStore) {
            this.postingStore = new PostingMapStore();
        }
        return this.postingStore;
    }

    requestCommentStore(): CommentStore {
        if (!this.commentStore) {
            this.commentStore = new CommentMapStore();
        }
        return this.commentStore;
    }
}

export default ClubMapStoreLycler;