import PostingService from "../service/PostingService";
import Posting from "../../step1/entity/board/Posting";
import TravelClub from "../../step1/entity/club/TravelClub";
import MapStorage from "./storage/MapStorage";
import PostingDto from "../service/dto/PostingDto";
import SocialBoard from "../../step1/entity/board/SocialBoard";

class PostingServiceLogic implements PostingService {

    boardMap: Map<string, SocialBoard>;
    postingMap: Map<string, Posting>;
    clubMap: Map<string, TravelClub>;

    constructor() {
        this.boardMap = MapStorage.getInstance().boardMap;
        this.postingMap = MapStorage.getInstance().postingMap;
        this.clubMap = MapStorage.getInstance().clubMap;
    }

    //Create
    register(boardId: string, postingDto: PostingDto): string {
        const foundClub = this.clubMap.get(boardId);        //BoardId = ClubId

        if (!foundClub) {
            throw new Error('\n> In the club, No such member with admin\'s email --> ' + postingDto.writerEmail);
        }
        foundClub.getMembershipBy(postingDto.writerEmail);          //해당 이메일의 멤버십 정보 가져오기

        const foundBoard = this.boardMap.get(boardId);

        if (!foundBoard) {
            throw new Error('\n> No such a board with id --->' + boardId);
        }

        //Dto to Entity
        const newPosting = postingDto.toPostingInBoard(foundBoard);

        this.postingMap.set(newPosting.getId(), newPosting);            //Entity로 저장!

        return newPosting.getId();
    }

    //Select
    find(postingId: string): PostingDto {
        const foundPosting = this.postingMap.get(postingId);

        if (!foundPosting) {
            throw new Error('\n> No such a posting with id: ' + postingId);
        }
        return PostingDto.fromEntity(foundPosting);     //보여줄 결과값은 Dto로 !! (Entity는 바로 보여주지 않는다.)
    }

    //BoardId에 해당하는 모든 게시물 찾기 (Select)
    findByBoardId(boardId: string): PostingDto[] {
        const foundBoard = this.boardMap.get(boardId);

        if (!foundBoard) {
            throw new Error('\n> No such a board with id --> ' + boardId);
        }
        const postings = Array.from(this.postingMap.values());

        return postings.filter(posting => posting.boardId === boardId)
                        .map(targetPosting => PostingDto.fromEntity(targetPosting));            //보여줄 결과값은 Dto로 보여준다
    }

    //Update
    modify(postingDto: PostingDto): void {
        const postingId = postingDto.usid;

        const targetPosting = this.postingMap.get(postingId);

        if (!targetPosting) {
            throw new Error('\n> No such a posting with id: ' + postingId);
        }

        //Entity에서 가져와
        if (!postingDto.title) {
            postingDto.title = targetPosting.title;
        }

        if (!postingDto.contents) {
            postingDto.contents = targetPosting.contents;
        }

        //update 시에 사용할 데이터는 Entity 타입이여야 함!
        const newPosting = postingDto.toPostingIn(postingId, targetPosting.boardId);

        this.postingMap.set(postingId, newPosting);     //Entity 타입으로 update
    }

    //Delete
    remove(postingId: string): void {
        if (!this.postingMap.get(postingId)) {
            throw new Error('\n> No such a posting with id: ' + postingId);
        }
        this.postingMap.delete(postingId);
    }
}

export default PostingServiceLogic;