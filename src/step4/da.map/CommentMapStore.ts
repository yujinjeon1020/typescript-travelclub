import CommentStore from "../store/CommentStore";
import Comment from "../../step1/entity/board/Comment";
import MemoryMap from "./io/MemoryMap";

class CommentMapStore implements CommentStore {

    commentMap: Map<string, Comment>;

    constructor() {
        this.commentMap = MemoryMap.getInstance().commentMap;
    }

    //Create
    create(comment: Comment): string {
        const targetComment = this.commentMap.get(comment.getId());

        if (targetComment) {
            throw new Error('\n> Already exists: ' + targetComment);
        }
        this.commentMap.set(comment.getId(), comment);

        return comment.getId();
    }

    //Select
    retrieve(commentId: string): Comment | null {
        return this.commentMap.get(commentId) || null;
    }

    //Select
    retrieveByPostingId(postingId: string): Comment[] {
        const comments = Array.from(this.commentMap.values());

        return comments.filter(comment => comment.postingId === postingId);
    }

    //Update
    update(comment: Comment): void {
        this.commentMap.set(comment.getId(), comment);
    }

    //Delete
    delete(commentId: string): void {
        this.commentMap.delete(commentId);
    }

    //존재여부
    exists(commentId: string): boolean {
        return this.commentMap.get(commentId) !== null;
    }
}

export default CommentMapStore;