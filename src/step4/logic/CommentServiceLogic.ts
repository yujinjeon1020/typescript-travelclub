import CommentService from "../service/CommentService";
import PostingStore from "../store/PostingStore";
import CommentStore from "../store/CommentStore";
import ClubMapStoreLycler from "../da.map/ClubMapStoreLycler";
import CommentDto from "../service/dto/CommentDto";

class CommentServiceLogic implements CommentService {

    postingStore: PostingStore;
    commentStore: CommentStore;

    constructor() {
        this.postingStore = ClubMapStoreLycler.getInstance().requestPostingStore();
        this.commentStore = ClubMapStoreLycler.getInstance().requestCommentStore();
    }

    //특정 게시글에 댓글 작성
    register(postingId: string, commentDto: CommentDto): string {
        //게시물을 먼저 찾고
        const foundPosting = this.postingStore.retrieve(postingId);

        if (!foundPosting) {
            throw new Error('No such posting with id -->' + postingId);
        }

        return this.commentStore.create(commentDto.toCommentInPosting(foundPosting));           //entity로 저장하기
    }

    //댓글 찾기
    find(commentId: string): CommentDto {
        const foundComment = this.commentStore.retrieve(commentId);

        if (!foundComment) {
            throw new Error('No such comment with id: ' + commentId);
        }
        return CommentDto.fromEntity(foundComment);                           //dto로 보여주기
    }

    //특정 게시글의 id로, 그 게시글에 달린 댓글들 배열로 찾기
    findByPostingId(postingId: string): CommentDto[] {
        const foundPosting = this.postingStore.retrieve(postingId);

        if (!foundPosting) {
            throw new Error('No such posting with id --> '  + postingId);
        }
        return this.commentStore.retrieveByPostingId(postingId).map(comment => CommentDto.fromEntity(comment));     //댓글들의 배열을 하나하나 dto로 변환해서 보여줌

    }

    //수정하기
    modify(commentDto: CommentDto): void {
        const commentId = commentDto.usid;
        const targetComment = this.commentStore.retrieve(commentId);

        if (!targetComment) {
            throw new Error('No such comment with id :' + commentId);
        }

        // if (commentDto.contents) {
        //     targetComment.contents = commentDto.contents;
        // }

        if (!commentDto.contents) {
            commentDto.contents = targetComment.contents;
        }

        this.commentStore.update(targetComment);
    }

    //제거하기
    remove(commentId: string): void {
        if (!this.commentStore.retrieve(commentId)) {
            throw new Error('No such comment with id: ' + commentId);
        }
        this.commentStore.delete(commentId);
    }
}

export default CommentServiceLogic;