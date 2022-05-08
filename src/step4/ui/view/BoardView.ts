import BoardDto from "../../service/dto/BoardDto";
import PostingService from "../../service/PostingService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import PostingDto from "../../service/dto/PostingDto";
import PostingView from "./PostingView";
import PostingMenu from "../menu/PostingMenu";

class BoardView {

    board: BoardDto;
    postingService: PostingService;
    postingMenu: PostingMenu;

    constructor(inputBoard: BoardDto) {             //BoardDto 객체 -> 해당하는 Board만 불러와서 보여주는 View 이므로
        const serviceFactory = ServiceLogicLycler.shareInstance();
        this.board = inputBoard;
        this.postingService = serviceFactory.createPostingService();
        this.postingMenu = new PostingMenu();
    }
    
    showMenu(): void {
        let inputNumber = 0;
        
        while (true) {
            this.displayMainMenu();
            inputNumber = this.selectMenu();
            
            switch (inputNumber) {
                case 1:
                    this.registerPosting();
                    break;
                case 2:
                    this.findAllPosting();
                    break;
                case 0:
                    return;
                default:
                    console.log('Choose Again!');
            }
        }
    }
    
    displayMainMenu(): void {
        //console.clear();
        console.log('...........................');
        console.log(' [Board Detail] ');
        console.log('    name: ' + this.board.name);
        console.log('    admin: ' + this.board.adminEmail);
        console.log('    createDate: ' + this.board.createDate);
        console.log('...........................');
        console.log(' 1. Register a posting');
        console.log(' 2. Find All postings');
        console.log('...........................');
        console.log(' 0. Previous');
        console.log('...........................');        
    }
    
    //게시글 등록
    registerPosting(): void {
        
        const title = question('\n posting title: ');
        const writerEmail = question(' posting writerEmail: ');
        const contents = question(' posting contents: ');
        
        //dto에 주입
        const postingDto = new PostingDto(title, writerEmail, contents);
        
        postingDto.usid = this.postingService.register(this.board.clubId, postingDto);
        console.log('\n> Registered a posting --> ', postingDto);
    }
    
    //모든 게시글 찾기
    findAllPosting(): void {
        let postings = this.postingService.findByBoardId(this.board.clubId);
        
        let inputNumber = 0;
        
        //console.clear();
        console.log('.........................');
        console.log(' [Board : ' + this.board.name + '] ');
        console.log('.........................');
        console.log(' Posting List ==> ');
        
        for (let idx in postings) {             //인덱스 0부터 시작
            let menuNumber = parseInt(idx) + 1; //메뉴번호는 1부터 시작
            console.log(' ' + menuNumber + '. ' + postings[idx].title);
        }
        
        console.log('..........................');
        console.log(' 0. Previous');
        console.log('..........................');
        inputNumber = this.selectPostingNumber(postings.length);            //게시글 선택
        
        if (inputNumber == 0) {
            return;
        }
        
        let selectPosting = postings[inputNumber - 1];              //선택한 게시글 번호 -> inputNumber(사용자 입력값)에서 -1 해줘야 배열의 index가 올바르게 선택됨
        let postingView = new PostingView(selectPosting);
        postingView.showMenu();
    }
    
    //게시글 보여주는 창에서 원하는 게시글 선택 입력
    selectPostingNumber(postingSize: number): number {
        const answer = question('Select Posting number: ');
        const postingNumber = parseInt(answer);
        if (postingNumber >= 0 && postingNumber <= postingSize) {
            return postingNumber;
        } else {
            console.log('It\'s a invalid number -> ' + postingNumber);
            return -1;
        }
    }
    
    //메뉴 선택 입력
    selectMenu(): number {
        const answer = question('Select number: ');
        const menuNumber = parseInt(answer);
        if (menuNumber >= 0 && menuNumber <= 2) {
            return menuNumber;
        } else {
            console.log('It\'s a invalid number -> ' + menuNumber);
            return -1;
        }
    }
}

export default BoardView;