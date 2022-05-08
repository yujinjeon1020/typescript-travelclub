import ClubService from "../../service/ClubService";
import BoardService from "../../service/BoardService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import TravelClubDto from "../../service/dto/TravelClubDto";
import {question} from "readline-sync";
import BoardDto from "../../service/dto/BoardDto";
import SocialBoard from "../../../step1/entity/board/SocialBoard";

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
                console.log('\n> Found club : ', clubFound);
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

    //게시판 생성
    register(): void {

        while (true) {
            //클럽을 먼저 찾고
            const targetClub = this.findClub();

            if (!targetClub) {
                return;
            }

            const boardName = question('\n board name to register (0. Board menu): ');

            if (boardName === '0') {
                return;
            }
            const adminEmail = question('\n admin member\'s email: ');

            //아래꺼 빼먹었다!!!!!!!!!!!!!!!
            const newBoard = new SocialBoard(targetClub.usid, boardName, adminEmail);       //ENTITY

            try {
                const newBoardDto = new BoardDto(newBoard.clubId, newBoard.name, newBoard.adminEmail);       //ENTITY -> DTO
                this.boardService.register(newBoardDto);
                console.log('\n> Registered board: ' , newBoardDto);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //이름으로 게시판 찾아 배열로 리턴하기
    findByName(): void {
        const boardName = question('\n board name to find (0. Board menu): ');

        if (boardName === '0') {
            return;
        }

        try {
            const boardDtos = this.boardService.findByName(boardName);

            let index = 0;

            for (const boardDto of boardDtos) {
                console.log(`\n [${index}]`, boardDto);
                index++
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //게시판 찾기
    findOne(): BoardDto | null {
        let boardFound = null;

        while (true) {
            const clubName = question('\n club name to find a board (0. Board menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                boardFound = this.boardService.findByClubName(clubName);
                if (boardFound) {
                    console.log('\n Found board: ', boardFound);
                }
                break;
            } catch(e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return boardFound;
    }

    //게시판 수정
    modify(): void {
        const targetBoard = this.findOne();

        if (!targetBoard) {
            console.log('No target board exists');
            return;
        }

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

    //게시판 삭제
    remove(): void {
        const targetBoard = this.findOne();

        if (!targetBoard) {
            return;
        }

        const confirmStr = question('Remove this board? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a board --> ' + targetBoard.name);
            this.boardService.remove(targetBoard.clubId);
        } else {
            console.log('\n> Remove cancelled, your board is safe --> ' + targetBoard.name);
        }
    }
}

export default BoardConsole;