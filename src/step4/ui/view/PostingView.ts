import PostingDto from "../../service/dto/PostingDto";
import CommentService from "../../service/CommentService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import CommentDto from "../../service/dto/CommentDto";

class PostingView {

    posting: PostingDto;
    commentService: CommentService;

    constructor(inputPosting: PostingDto) {                 //해당하는 posting만을 가져와서 보여주는 View 이므로
        const serviceFactory = ServiceLogicLycler.shareInstance();

        this.posting = inputPosting;
        this.commentService = serviceFactory.createCommentService();
    }

    showMenu(): void {
        let inputNumber = 0;

        while (true) {
            this.displayMainMenu();
            inputNumber = this.selectMenu();

            switch (inputNumber) {
                case 1:
                    this.registerComment();
                    break;
                case 2:
                    this.findAllComments();
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
        console.log('..............................');
        console.log(' [Posting Detail] ');
        console.log('   title: ' + this.posting.title);         //PostingDto에서 데이터 가져오기
        console.log('   writer: ' + this.posting.writerEmail);
        console.log('   contents: ' + this.posting.contents);
        console.log('   written date: ' + this.posting.writtenDate);
        console.log('..............................');
        console.log(' 1. Register a comment');
        console.log(' 2. Find All comments');
        console.log('..............................');
        console.log(' 0. Previous');
        console.log('..............................');
    }

    //댓글 등록
    registerComment(): void {
        const writer = question(' comment writer: ');
        const contents = question(' comment contents: ');

        //dto에 데이터 주입
        const commentDto = new CommentDto(writer, contents);
        commentDto.usid = this.commentService.register(this.posting.usid, commentDto);

        console.log('\n> Registered a comment --> ', commentDto);
    }

    //모든 댓글 보기
    findAllComments(): void {
        let comments = this.commentService.findByPostingId(this.posting.usid);          //배열

        let inputNumber = 0;

        //console.clear();
        console.log('............................');
        console.log(' [Posting : ' + this.posting.title + '] ');
        console.log('............................');
        console.log('  Comments ==> ');

        //comment 는 따로 메뉴 선택 기능이 없고..그냥 조회만 하는 것 같음
        for (let idx in comments) {
            console.log(' ' + comments[idx].contents);
        }
        console.log(' 1. Modify a comment');
        console.log(' 2. Remove a comment');
        console.log('............................');
        console.log(' 0. Previous');
        console.log('............................');

        inputNumber = this.selectKey();
        if (inputNumber == 0) {         //Previous
            return;
        }
    }

    //comment 보여주는 창에서의 원하는 메뉴 선택 (0. Previous만 존재함)
    selectKey(): number {
        const answer = question('Select number: ');
        const key = parseInt(answer);

        if (key == 0) {     //Previous만 존재하므로 0만 입력 받아야 함!
            return key;
        } else {
            console.log('It\'s a invalid number ->' + key);
            return -1;
        }
    }

    //게시글 보여준 후 댓글 기능 사용을 위한 메뉴 선택
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

export default PostingView;