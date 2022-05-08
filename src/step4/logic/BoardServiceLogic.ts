import BoardService from "../service/BoardService";
import BoardStore from "../store/BoardStore";
import ClubStore from "../store/ClubStore";
import ClubMapStoreLycler from "../da.map/ClubMapStoreLycler";
import BoardDto from "../service/dto/BoardDto";
import boardDto from "../service/dto/BoardDto";

class BoardServiceLogic implements BoardService {

    boardStore: BoardStore;
    clubStore: ClubStore;

    constructor() {
        this.boardStore = ClubMapStoreLycler.getInstance().requestBoardStore();
        this.clubStore = ClubMapStoreLycler.getInstance().requestClubStore();
    }

    //게시판 등록
    register(boardDto: BoardDto): string {
        const boardId = boardDto.clubId;                        //boardId = clubId
        const targetBoard = this.boardStore.retrieve(boardId);

        if (targetBoard) {
            throw new Error('Board already exists in the club --> ' + targetBoard.name);
        }

        //클럽 찾기
        const clubFound = this.clubStore.retrieve(boardId);

        if (!clubFound) {
            throw new Error('No such club with id: ' + boardId);
        }

        const adminEmail = clubFound.getMembershipBy(boardDto.adminEmail);

        if (!adminEmail) {
            throw new Error('In the club, No such member with admin\'s email --> ' + boardDto.adminEmail);
        }
        return this.boardStore.create(boardDto.toBoard());            //Entity로 저장하기
    }

    //게시판 찾기
    find(boardId: string): BoardDto {
        const board = this.boardStore.retrieve(boardId);

        if (!board) {
            throw new Error('No such board with id --> ' + boardId);
        }
        return BoardDto.fromEntity(board);                                  //dto로 보여주기
    }

    //이름으로 게시판 찾아 목록 보여주기
    findByName(boardName: string): BoardDto[] {
        const boards = this.boardStore.retrieveByName(boardName);

        if (!boards.length) {
            throw new Error('No such board with name --> ' + boardName);
        }
        return boards.map(board => BoardDto.fromEntity(board));             //dto로 보여주기 (배열은 map() 써서 하나하나 dto로 변환해줘야 함)
    }

    //모든 게시판 찾기
    findAll(): BoardDto[] {
        const boards = this.boardStore.retrieveAll();
        return boards.map(board => BoardDto.fromEntity(board));             //dto로 보여주기 (배열은 map() 써서 하나하나 dto로 변환해줘야 함)
    }

    //클럽 이름으로 게시판 찾기
    findByClubName(clubName: string): BoardDto | null {
        //1. 클럽 찾기
        const foundClub = this.clubStore.retrieveByName(clubName);

        if (!foundClub) {
            throw new Error('No such club with name: ' + clubName);
        }
        //2. 클럽 id로 게시판찾기 (클럽id = 게시판id)
        const board = this.boardStore.retrieve(foundClub.getId());
        return board ? BoardDto.fromEntity(board) : null;
    }

    //게시판 수정
    modify(boardDto: BoardDto): void {
        const boardId = boardDto.clubId;            //clubId == boardId
        const targetBoard = this.boardStore.retrieve(boardId);

        if (!targetBoard) {
            throw new Error('No such board with id --> ' + boardDto.clubId);
        }

        //수정이 되었으면 Entity로 값 넘기기
        // if (boardDto.name) {
        //     targetBoard.name = boardDto.name;
        // }
        //
        // if (boardDto.adminEmail) {
        //     targetBoard.adminEmail = boardDto.adminEmail;
        // }

        //수정이 안되었으면 Entity에서 이전 값 받아오기
        if (!boardDto.name) {
            boardDto.name = targetBoard.name;
        }

        if (!boardDto.adminEmail) {
            boardDto.adminEmail = targetBoard.adminEmail;
        }
        
        //클럽찾기
        const foundClub = this.clubStore.retrieve(boardId);
        
        if (!foundClub) {
            throw new Error('No such club with id --> ' + boardId);
        }
        
        //admin email 수정을 위해 멤버십 불러옴
        const membership = foundClub.getMembershipBy(boardDto.adminEmail);
        
        if (!membership) {
            throw new Error('In the club, No such member with admin\'s email-->' + boardDto.adminEmail);
        }
        this.boardStore.update(boardDto.toBoard());
    }

    //게시판 삭제
    remove(boardId: string): void {
        //게시판을 가져온다음
        const foundBoard = this.boardStore.retrieve(boardId);

        if (!foundBoard) {
            throw new Error('No such board with id --> ' + boardId);
        }
        this.boardStore.delete(boardId);
    }
}

export default BoardServiceLogic;