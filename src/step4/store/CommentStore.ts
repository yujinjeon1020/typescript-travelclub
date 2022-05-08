import Comment from "../../step1/entity/board/Comment";

interface CommentStore {

    create(comment: Comment): string;
    retrieve(commentId: string): Comment | null;
    retrieveByPostingId(postingId: string): Comment[];
    update(comment: Comment): void;
    delete(commentId: string): void;

    exists(commentId: string): boolean;
}

export default CommentStore;