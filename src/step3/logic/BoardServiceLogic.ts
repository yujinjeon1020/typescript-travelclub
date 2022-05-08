import BoardService from "../service/BoardService";
import SocialBoard from "../../step1/entity/board/SocialBoard";
import TravelClub from "../../step1/entity/club/TravelClub";
import MapStorage from "./storage/MapStorage";
import BoardDto from "../service/dto/BoardDto";

class BoardServiceLogic implements BoardService {

    boardMap: Map<string, SocialBoard>;
    clubMap: Map<string, TravelClub>;

    constructor() {
        this.boardMap = MapStorage.getInstance().boardMap;
        this.clubMap = MapStorage.getInstance().clubMap;
    }

    //Create
    register(boardDto: BoardDto): string {
        const boardId = boardDto.clubId;
        const targetBoard = this.boardMap.get(boardId);

        //이미 존재
        if (targetBoard) {
            throw new Error('Board already exists in the club --> ' + targetBoard.name);
        }

        const clubFound = this.clubMap.get(boardDto.clubId);

        if (!clubFound) {
            throw new Error('No such club with id: ' + boardId);
        }

        const adminMembership = clubFound.getMembershipBy(boardDto.adminEmail);

        if (!adminMembership) {
            throw new Error('In the club, No such member with admin\'s email --> ' + boardDto.adminEmail);
        }

        //저장할 Entity 데이터
        const board = boardDto.toBoard();
        this.boardMap.set(boardId, board);

        return boardId;
    }

    //Select
    find(boardId: string): BoardDto {
        const board = this.boardMap.get(boardId);

        //존재하지 않으면
        if (!board) {
            throw new Error('No such board with id --> ' + boardId);
        }
        return BoardDto.fromEntity(board);              //보여줄 땐 Dto!
    }

    //Select - 게시판 이름으로 게시판 목록 조회
    findByName(boardName: string): BoardDto[] {
        const boards = Array.from(this.boardMap.values());           //모든 게시판 데이터를 가져와서

        //게시글 없으면
        if (!boards || !boards.length) {
            throw new Error('No boards in the storage');
        }
        const boardDtos = boards.filter(board => board.name === boardName)      //이름이 같은 게시판만 filtering 후
            .map(board => BoardDto.fromEntity(board));                      //Dto로 보여줌!

        if (!boardDtos.length) {
            throw new Error('No such board with name -->' + boardName);
        }
        return boardDtos;
    }

    //Select - 클럽 이름으로 게시판 찾기
    findByClubName(clubName: string): BoardDto | null {
        const clubs = Array.from(this.clubMap.values());        //모든 클럽을 가져와서 배열로 바꾼다음에

        const foundClub = clubs.find(club => club.name === clubName);       //검색하는 클럽 이름과 이름이 동일한 클럽만 find 해서 배열로 놔둠

        if (!foundClub) {
            throw new Error('No such club with name: ' + clubName);
        }
        const board = this.boardMap.get(foundClub.getId());         //검색하는 클럽 이름과 통일한 이름을 가진 클럽들의 게시판을 가져옴
        //const board = this.boardMap.get(foundClub.usid);
        // console.log(foundClub.usid);
        // console.log(board);

        return board ? BoardDto.fromEntity(board) : null;           //게시판이 있으면 Dto로 보여주고, 없으면 null
    }

    //Update
    modify(boardDto: BoardDto): void {
        const boardId = boardDto.clubId;
        const targetBoard = this.boardMap.get(boardId);

        if (!targetBoard) {
            throw new Error('No such board with id --> ' + boardId);
        }

        //From Entity
        if (!boardDto.name) {
            boardDto.name = targetBoard.name;
        }

        if (!boardDto.adminEmail) {
            boardDto.adminEmail = targetBoard.adminEmail;
        }

        const foundClub = this.clubMap.get(boardDto.clubId);

        if (!foundClub) {
            throw new Error('No such club with id --> ' + boardDto.clubId);
        }

        const membership = foundClub.getMembershipBy(boardDto.adminEmail);

        if (!membership) {
            throw new Error('In the club, No such member with admin\'s email --> ' + boardDto.adminEmail);
        }
        this.boardMap.set(boardId, boardDto.toBoard());     //Entity로 저장!
    }

    //Delete
    remove(boardId: string): void {
        const foundBoard = this.boardMap.get(boardId);

        if (!foundBoard) {
            throw new Error('No such board with id --> ' + boardId);
        }
        this.boardMap.delete(boardId);
    }
}

export default BoardServiceLogic;