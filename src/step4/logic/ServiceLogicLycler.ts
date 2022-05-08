import ServiceLycler from "../service/ServiceLycler";
import ClubService from "../service/ClubService";
import MemberService from "../service/MemberService";
import BoardService from "../service/BoardService";
import PostingService from "../service/PostingService";
import CommentService from "../service/CommentService";
import ClubServiceLogic from "./ClubServiceLogic";
import MemberServiceLogic from "./MemberServiceLogic";
import BoardServiceLogic from "./BoardServiceLogic";
import PostingServiceLogic from "./PostingServiceLogic";
import CommentServiceLogic from "./CommentServiceLogic";

class ServiceLogicLycler implements ServiceLycler {

    private static lycler: ServiceLycler;

    clubService: ClubService | null;
    memberService: MemberService | null;
    boardService: BoardService | null;
    postingService: PostingService | null;
    commentService: CommentService | null;

    private constructor() {
        this.clubService = null;
        this.memberService = null;
        this.boardService = null;
        this.postingService = null;
        this.commentService = null;
    }

    static shareInstance(): ServiceLycler {
        if (!this.lycler) {
            this.lycler = new ServiceLogicLycler();
        }
        return this.lycler;
    }

    createClubService(): ClubService {
        if (!this.clubService) {
            this.clubService = new ClubServiceLogic();
        }
        return this.clubService;
    }

    createMemberService(): MemberService {
        if (!this.memberService) {
            this.memberService = new MemberServiceLogic();
        }
        return this.memberService;
    }

    createBoardService(): BoardService {
        if (!this.boardService) {
            this.boardService = new BoardServiceLogic();
        }
        return this.boardService;
    }

    createPostingService(): PostingService {
        if (!this.postingService) {
            this.postingService = new PostingServiceLogic();
        }
        return this.postingService;
    }

    createCommentService(): CommentService {
        if (!this.commentService) {
            this.commentService = new CommentServiceLogic();
        }
        return this.commentService;
    }
}

export default ServiceLogicLycler;