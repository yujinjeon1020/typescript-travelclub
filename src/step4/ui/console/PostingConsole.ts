import BoardDto from "../../service/dto/BoardDto";
import BoardService from "../../service/BoardService";
import PostingService from "../../service/PostingService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import PostingDto from "../../service/dto/PostingDto";

class PostingConsole {

    currentBoard: BoardDto | null = null;

    boardService: BoardService;
    postingService: PostingService;

    constructor() {
        const serviceFactory = ServiceLogicLycler.shareInstance();

        this.boardService = serviceFactory.createBoardService();
        this.postingService = serviceFactory.createPostingService();
    }

    //현재 게시판 선택 되어있는지 여부
    hasCurrentBoard(): boolean {
        return this.currentBoard !== null;
    }

    //게시판 이름 가져오기
    requestCurrentBoardName(): string | null {
        let clubName = null;

        if (this.hasCurrentBoard() && this.currentBoard) {
            clubName = this.currentBoard.name;
        }
        return clubName;
    }

    //게시판 찾기 -> currentBoard에 지정
    findBoard(): void {
        let boardFound = null;

        while (true) {
            const clubName = question('\n club name to find a board (0. Posting menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                boardFound = this.boardService.findByClubName(clubName);
                console.log('\n> Found board: ', boardFound);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
            boardFound = null;
        }
        this.currentBoard = boardFound;
    }

    //게시판 등록 후 id 보여줌
    register(): void {
        if (!this.hasCurrentBoard()) {
            console.log('> No target board yet. Find target board first.');
            return;
        }

        while (true) {
            const title = question('\n posting title (0. Posting menu): ');

            if (title === '0') {
                return;
            }

            const writerEmail = question('posting writerEmail: ');
            const contents = question('posting contents: ');

            try {
                if (this.currentBoard) {
                    const postingDto = new PostingDto(title, writerEmail, contents);

                    postingDto.usid = this.postingService.register(this.currentBoard.clubId, postingDto);
                    console.log('\n> Registered a posting ---> ', postingDto);
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //게시판 id에 해당하는 모든 게시글 배열로 찾기
    findByBoardId(): void {
        if (!this.hasCurrentBoard()) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        try {
            if (this.currentBoard) {
                const postings = this.postingService.findByBoardId(this.currentBoard.clubId);           //PostingDto[] 배열

                let index = 0;

                for(const postingDto of postings) {
                    console.log(`[${index}], ` + postingDto.postingDtoInfo);
                    index++;        //+1씩 인덱스 증가
                }

            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //게시판 찾기
    find(): void {
        if (!this.hasCurrentBoard()) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        let postingDto = null;

        while (true) {
            const postingId = question('\n posting id to find (0. Posting menu): ');

            if (postingId === '0') {
                break;
            }

            try {
                postingDto = this.postingService.find(postingId);
                console.log('\n> Found posting: ', postingDto);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //게시글 찾기 - 수정, 삭제 시 이용
    findOne() {
        if (!this.hasCurrentBoard()) {
            console.log('> No target board yet. Find target board first.');
            return null;
        }

        let postingDto = null;

        while (true) {
            const postingId = question('\n> posting id to find (0. Posting menu): ');

            if (postingId === '0') {
                break;
            }

            try {
                postingDto = this.postingService.findAndFixed(postingId);
                console.log('\n> Found posting: ', postingDto);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
            //postingDto = null;
        }
        return postingDto;
    }

    //게시글 수정
    modify(): void {
        const targetPosting = this.findOne();

        if (!targetPosting) {
            return;
        }

        //////////////////////////////////////////////////
        //관리자나 글쓴이만 게시글 수정/삭제가 가능하도록 함
        if(!this.currentBoard) {
            return;
        }
        const adminEmail = this.currentBoard.adminEmail;

        const writerChk = question('\n Your email? (0. Posting menu) ');

        if (writerChk === '0') {
            return;
        }

        if (writerChk !== targetPosting.writerEmail && writerChk !== adminEmail) {
            console.log('\n> Writer or Admin are allowed to modify the posting.');
            return;
        }
        //////////////////////////////////////////////////

        const newTitle = question('\n new posting title (0. Posting menu, Enter. no change): ');

        if (newTitle === '0') {
            return;
        }
        targetPosting.title = newTitle;

        const contents = question('\n new posting contents (Enter. no change): ');
        targetPosting.contents = contents;

        try {
            this.postingService.modify(targetPosting);
            console.log('\n> Modified posting: ', targetPosting);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //게시글 삭제
    remove(): void {
        const targetPosting = this.findOne();

        if (!targetPosting) {
            return;
        }

        //////////////////////////////////////////////////
        //관리자나 글쓴이만 게시글 수정/삭제가 가능하도록 함
        if(!this.currentBoard) {
            return;
        }
        const adminEmail = this.currentBoard.adminEmail;

        const writerChk = question('\n Your email? (0. Posting menu) ');

        if (writerChk === '0') {
            return;
        }

        if (writerChk !== targetPosting.writerEmail && writerChk !== adminEmail) {
            console.log('\n> Writer or Admin are allowed to remove the posting.');
            return;
        }
        //////////////////////////////////////////////////

        const confirmStr = question('Remove this posting in the board? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a posting ---> ', targetPosting.title);
            this.postingService.remove(targetPosting.usid);
        } else {
            console.log('> Remove cancelled, the posting is safe --> ' + targetPosting.title);
        }
    }
}

export default PostingConsole;