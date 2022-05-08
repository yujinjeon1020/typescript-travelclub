import BoardDto from "../../service/dto/BoardDto";
import BoardService from "../../service/BoardService";
import PostingService from "../../service/PostingService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import PostingDto from "../../service/dto/PostingDto";
import posting from "../../../step1/entity/board/Posting";

class PostingConsole {

    currentBoard: BoardDto | null = null;

    boardService: BoardService;
    postingService: PostingService;

    constructor() {
        const serviceFactory = ServiceLogicLycler.shareInstance();

        this.boardService = serviceFactory.createBoardService();
        this.postingService = serviceFactory.createPostingService();
    }

    //선택한 게시판이 있는지
    hasCurrentBoard(): boolean {
        return this.currentBoard !== null;
    }

    //현재 게시판의 이름 가져오기
    requestCurrentBoardName(): string | null {
        let clubName = null;

        if (this.currentBoard) {
            clubName = this.currentBoard.name;
        }
        return clubName;
    }

    //게시판 찾기
    findBoard(): void {
        let boardFound = null;

        while (true) {
            const clubName = question('\n club name to find a board (0. Posting menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                boardFound = this.boardService.findByClubName(clubName);
                console.log('\n> Found board: ' , boardFound);
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

    //게시글 등록
    register(): void {
        if (!this.currentBoard) {
            console.log('\n> No target board yet. Find target board first. ');
            return;
        }

        while (true) {
            const title = question('\n posting title (0. Posting menu): ');

            if (title === '0') {
                return;
            }
            const writerEmail = question(' posting writerEmail: ');
            const contents = question(' posting contents: ');

            try {
                const postingDto = new PostingDto(title, writerEmail, contents);

                //register 후 postingId 리턴
                postingDto.usid = this.postingService.register(this.currentBoard.clubId, postingDto);
                console.log('\n> Registered a posting --> ', postingDto);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //게시판 아이디로 게시글 목록 찾기
    findByBoardId(): void {
        if (!this.currentBoard) {
            console.log('\n> No target club yet. Find target club first.');
            return;
        }

        try {
            const postings = this.postingService.findByBoardId(this.currentBoard.clubId);

            let index = 0;

            //게시글 배열에서 게시글 정보를 하나씩 가져오기
            for (const postingDto of postings) {
                console.log(`[${index}], ` + postingDto.postingDtoInfo);
                index++
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //게시글 id로 게시글 찾기
    find(): void {
        if (!this.currentBoard) {
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

    //수정, 삭제시 이용하는 게시글 찾기 메소드
    findOne(): PostingDto | null {
        if (!this.currentBoard) {
            console.log('> No target board yet. Find target board first. ');
            return null;
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
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
            postingDto = null;
        }
        return postingDto;
    }

    //게시글 수정
    modify(): void {
        const targetPosting = this.findOne();

        if (!targetPosting) {
            return;
        }

        //제목 수정
        const newTitle = question('\n new posting title (0. Posting menu, Enter. no change): ');

        if (newTitle === '0') {
            return;
        }
        targetPosting.title = newTitle;

        //내용 수정
        const contents = question('new posting contents (Enter. no change): ');
        targetPosting.contents = contents;

        try {
            this.postingService.modify(targetPosting);
            console.log('\n> Modified posting: ' , targetPosting);
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

        const confirmStr = question('Remove this posting in the board? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a posting --> ' + targetPosting.title);
            this.postingService.remove(targetPosting.usid);
        } else {
            console.log('\n> Remove cancelled, your posting is safe. --> ' + targetPosting.title);
        }
    }
}

export default PostingConsole;