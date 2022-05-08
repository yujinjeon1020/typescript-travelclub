import ClubService from "../../service/ClubService";
import BoardService from "../../service/BoardService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import TravelClubDto from "../../service/dto/TravelClubDto";
import {question} from "readline-sync";
import SocialBoard from "../../../step1/entity/board/SocialBoard";
import BoardDto from "../../service/dto/BoardDto";
import BoardView from "../view/BoardView";

class BoardConsole {

    clubService: ClubService;
    boardService: BoardService;

    constructor() {
        this.clubService = ServiceLogicLycler.shareInstance().createClubService();
        this.boardService = ServiceLogicLycler.shareInstance().createBoardService();
    }

    //클럽 찾기
    findClub(): TravelClubDto | null {
        let clubFound = null;

        while (true) {
            const clubName = question('\n club name to find (0. Member menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                clubFound = this.clubService.findByName(clubName);
                console.log('\n> Found club: ', clubFound);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
            clubFound = null;
        }
        return clubFound;
    }

    //클럽 등록
    register(): void {
        const targetClub = this.findClub();

        if (!targetClub) {
            return;
        }

        //게시판 이름 등록
        const boardName = question('\n Board name to register (0. Board menu): ');

        if (boardName === '0') {
            return;
        }

        //게시판 관리자 이메일 등록
        const adminEmail = question(' Admin member\'s email: ');

        const newBoard = new SocialBoard(targetClub.usid, boardName, adminEmail);

        try {
            const newBoardDto = new BoardDto(newBoard.clubId, newBoard.name, newBoard.adminEmail);

            this.boardService.register(newBoardDto);
            console.log('\n> Registered board: ', newBoardDto);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //이름으로 게시판 찾아 해당 이름을 가진 게시판들을 dto 배열로 리턴
    findByName(): void {
        const boardName = question('\n Board name to find (0. Board Menu): ');

        if (boardName === '0') {
            return;
        }

        try {
            const boardDtos = this.boardService.findByName(boardName);

            let index = 0;

            for (const boardDto of boardDtos) {
                console.log(`\n> [${index}]: `, boardDto);
                index++;
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //클럽 이름으로 게시판 찾기 -수정, 삭제시 시용
    findOne(): BoardDto | null {

        let boardFound = null;

        while (true) {
            const clubName = question('\n> club name to find a board (0. Board menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                boardFound = this.boardService.findByClubName(clubName);
                console.log('\n> Found club: ', boardFound);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return boardFound;
    }

    //모든 게시판 찾아 배열로 보여주기
    findAll(): void {
        let boards = this.boardService.findAll();
        let inputNumber = 0;
        //console.clear();
        console.log('........................');
        console.log(' Board List ==> ');

        for (let idx in boards) {
            let menuNumber = parseInt(idx) + 1;                //index 0부터 시작하니까 +1 해줘서 1부터 시작하도록 함
            console.log('  ' + menuNumber + '. ' + boards[idx].name);
        }
        console.log('........................');
        console.log(' 0. Previous');
        console.log('........................');
        inputNumber = this.selectBoardNumber(boards.length);

        if (inputNumber == 0) {         //1부터 시작하므로
            return;
        }

        let selectBoard = boards[inputNumber-1];                //idx는 0부터 시작하고, 사용자에게 보여주는 번호는 1부터 시작하므로, 해당 인덱스를 가져오려면 사용자 입력값에서 -1 해줘야함
        let boardView = new BoardView(selectBoard);             //선택한 게시판을 보여주는 view
        boardView.showMenu();
    }

    selectBoardNumber(boardSize: number): number {                      //위에서 boardSize = boards.length 매개변수로 줌
        const answer = question('Select board number: ');
        const boardNumber = parseInt(answer);
        if (boardNumber >= 0 && boardNumber <= boardSize) {
            return boardNumber;
        } else {
            console.log('It\'s a invalid number -> ' + boardNumber);
            return -1;
        }
    }

    //게시판 수정
    modify(): void {
        const targetBoard = this.findOne();

        if (!targetBoard) {
            return;
        }

        ///////////////////////////////////////////////
        //게시판의 admin만 게시판을 수정/삭제 가능하도록 함
        const admin = targetBoard.adminEmail;

        const tryModify = question('\n Insert admin\'s email (0. Board menu): ');

        if (tryModify === '0') {
            return;
        }

        if (tryModify !== admin) {
            console.log('\n> Only board\'s admin is allowed to modify the board');
            return;
        }
        ///////////////////////////////////////////////

        const newBoardName = question('\n new board name to modify (0. Board menu, Enter. no change): ');
        if (newBoardName === '0') {
            return;
        }
        targetBoard.name = newBoardName;

        const newAdminEmail = question('\n new admin member\'s email (Enter. no change): ');
        targetBoard.adminEmail = newAdminEmail;

        try {
            this.boardService.modify(targetBoard);
            console.log('\n> Modified board: ', targetBoard);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //게시판 제거
    remove(): void {
        const targetBoard = this.findOne();

        if (!targetBoard) {
            return;
        }

        ///////////////////////////////////////////////
        //게시판의 admin만 게시판을 수정/삭제 가능하도록 함
        const admin = targetBoard.adminEmail;

        const tryRemove = question('\n Insert admin\'s email (0. Board Menu): ');

        if (tryRemove === '0') {
            return;
        }

        if (tryRemove !== admin) {
            console.log('\n> Only board\'s admin is allowed to remove the board.');
            return;
        }
        ///////////////////////////////////////////////

        const confirmStr = question('Remove this board? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a board --> ' + targetBoard.name);
            this.boardService.remove(targetBoard.clubId);
        } else {
            console.log('\n> Remove cancelled, your board is safe. --> ' + targetBoard.name);
        }
    }
}

export default BoardConsole;