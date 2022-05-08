import PostingService from "../service/PostingService";
import BoardStore from "../store/BoardStore";
import PostingStore from "../store/PostingStore";
import ClubStore from "../store/ClubStore";
import ClubMapStoreLycler from "../da.map/ClubMapStoreLycler";
import PostingDto from "../service/dto/PostingDto";
import exp from "constants";

class PostingServiceLogic implements PostingService {

    boardStore: BoardStore;
    postingStore: PostingStore;
    clubStore: ClubStore;

    constructor() {
        this.boardStore = ClubMapStoreLycler.getInstance().requestBoardStore();
        this.postingStore = ClubMapStoreLycler.getInstance().requestPostingStore();
        this.clubStore = ClubMapStoreLycler.getInstance().requestClubStore();
    }

    //게시글 등록
    register(boardId: string, postingDto: PostingDto): string {
        const foundClub = this.clubStore.retrieve(boardId);

        if (!foundClub) {
            throw new Error('No such club with id --> ' + boardId);
        }
        const membership = foundClub.getMembershipBy(postingDto.writerEmail);

        if (!membership) {
            throw new Error('In the club, No such member with admin\'s email --> ' + postingDto.writerEmail);
        }

        const foundBoard = this.boardStore.retrieve(boardId);

        if (!foundBoard) {
            throw new Error('No such board with id -->' + boardId);
        }

        return this.postingStore.create(postingDto.toPostingInBoard(foundBoard));
    }

    //게시글 찾기
    find(postingId: string): PostingDto {
        const foundPosting = this.postingStore.retrieve(postingId);

        if (!foundPosting) {
            throw new Error('No such posting with id: ' + postingId);
        }
        return PostingDto.fromEntity(foundPosting);
    }

    //게시글 찾기 (수정 삭제시 조회수 증가X)
    findAndFixed(postingId: string): PostingDto {
        const foundPosting = this.postingStore.retrieve(postingId);

        if (!foundPosting) {
            throw new Error('No such posting with id: ' + postingId);
        }
        return PostingDto.fromEntityForFixedRC(foundPosting);
    }

    //게시판 아이디로 모든 게시물 찾기
    findByBoardId(boardId: string): PostingDto[] {
        const foundBoard = this.boardStore.retrieve(boardId);

        if (!foundBoard) {
            throw new Error('No such board with id -->' + boardId);
        }
        return this.postingStore.retrieveByBoardId(boardId).map(posting => PostingDto.fromEntityForFixedRC(posting));         //해당 게시판 내 모든 게시글을 가져와서 하나하나 dto로 변환해서 보여줌
    }

    //게시판 수정
    modify(postingDto: PostingDto): void {
        const postingId = postingDto.usid;

        const targetPosting = this.postingStore.retrieve(postingId);

        if (!targetPosting) {
            throw new Error('No such posting with id: ' + postingId);
        }

        //변경사항 없으면 Entity에서 원래 데이터 가져오기
        if (!postingDto.title) {
            postingDto.title = targetPosting.title;
        }

        if (!postingDto.contents) {
            postingDto.contents = targetPosting.contents;
        }

        this.postingStore.update(postingDto.toPostingIn(postingId, targetPosting.boardId));
    }

    //게시판 삭제
    remove(postingId: string): void {
        if (!this.postingStore.retrieve(postingId)) {
            throw new Error('No such posting with id: ' + postingId);
        }
        this.postingStore.delete(postingId);
    }
}

export default PostingServiceLogic;