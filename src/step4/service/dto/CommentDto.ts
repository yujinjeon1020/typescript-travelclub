import DateUtil from "../../../util/DateUtil";
import Comment from "../../../step1/entity/board/Comment";
import Posting from "../../../step1/entity/board/Posting";

class CommentDto {

    usid: string = '';
    writer: string = '';
    contents: string = '';
    writtenDate: string = '';

    constructor(writer: string, contents: string) {
        this.writer = writer;
        this.contents = contents;
        this.writtenDate = DateUtil.today();
    }

    //from Entity to Dto
    static fromEntity(comment: Comment): CommentDto {
        //Dto 객체 생성
        const commentDto = new CommentDto(comment.writer, comment.contents);

        //주입
        commentDto.writtenDate = comment.writtenDate;

        return commentDto;
    }

    get commentDtoInfo(): string {
        return `Comment id: ${this.usid}, writer: ${this.writer}, contents: ${this.contents}, written date: ${this.writtenDate}`;
    }

    //to Entity
    //게시글에 댓글 새로 작성
    toCommentInPosting(posting: Posting): Comment {
        //Entity 객체 생성
        const comment = new Comment(posting.nextCommentId, posting.getId(), this.writer, this.contents);

        //주입
        comment.writtenDate = this.writtenDate;

        return comment;
    }
}

export default CommentDto;