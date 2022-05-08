import DateUtil from "../../../util/DateUtil";
import Posting from "../../../step1/entity/board/Posting";
import SocialBoard from "../../../step1/entity/board/SocialBoard";

class PostingDto {

    usid: string = '';
    title: string = '';
    writerEmail: string = '';
    contents: string = '';
    writtenDate: string = '';
    readCount: number = 0;

    constructor(title: string, writerEmail: string, contents: string) {
        this.title = title;
        this.writerEmail = writerEmail;
        this.contents = contents;
        this.writtenDate = DateUtil.today();
    }

    //Entity -> Dto  (from Entity)
    static fromEntity(posting: Posting): PostingDto {
        //Dto 객체 생성
        const postingDto = new PostingDto(posting.title, posting.writerEmail, posting.contents);

        //주입 (from Entity to Dto)
        postingDto.usid = posting.usid;
        postingDto.writtenDate = posting.writtenDate;
        postingDto.readCount = ++posting.readCount;

        return postingDto;
    }

    //Entity -> Dto  (from Entity)
    static fromEntityForFixedRC(posting: Posting): PostingDto {
        //Dto 객체 생성
        const postingDto = new PostingDto(posting.title, posting.writerEmail, posting.contents);

        //주입 (from Entity to Dto)
        postingDto.usid = posting.usid;
        postingDto.writtenDate = posting.writtenDate;
        postingDto.readCount = posting.readCount;

        return postingDto;
    }

    get postingDtoInfo(): string {
        return `Posting id: ${this.usid}, title: ${this.title}, writer email: ${this.writerEmail}, read count: ${this.readCount}, written date: ${this.writtenDate}, contents: ${this.contents}`;
    }

    //to Entity
    //새 글 작성시
    toPostingInBoard(board: SocialBoard): Posting {
        //Entity 객체 생성
        const posting = new Posting(board.nextPostingId, board.getId(), this.title, this.writerEmail, this.contents);

        //주입 (from Dto to Entity)
        posting.writtenDate = this.writtenDate;
        posting.readCount = this.readCount;

        return posting;
    }

    //to Entity
    //수정, 삭제시
    toPostingIn(postingId: string, boardId: string): Posting {
        //Entity 객체 생성
        const posting = new Posting(postingId, boardId, this.title, this.writerEmail, this.contents);

        //주입 (from Dto to Entity)
        posting.writtenDate = this.writtenDate;
        posting.readCount = this.readCount;

        return posting;
    }
}

export default PostingDto;