import PostingStore from "../store/PostingStore";
import Posting from "../../step1/entity/board/Posting";
import MemoryMap from "./io/MemoryMap";

//CRUD 기능, Entity만 갖고 놀기 (Select는 result가 Dto)
class PostingMapStore implements PostingStore {

    postingMap: Map<string, Posting>;

    constructor() {
        this.postingMap = MemoryMap.getInstance().postingMap;
    }

    //Create 후 게시글 id 리턴
    create(posting: Posting): string {
        const targetPosting = this.postingMap.get(posting.getId());

        if (targetPosting) {
            throw new Error('\n> Already exists: ' + targetPosting);
        }
        this.postingMap.set(posting.getId(), posting);

        return posting.getId();
    }

    //Select
    retrieve(postingId: string): Posting | null {
        return this.postingMap.get(postingId) || null;
    }

    //Select
    retrieveByBoardId(boardId: string): Posting[] {
        const postings = Array.from(this.postingMap.values());
        return postings.filter(posting => posting.boardId === boardId);
    }

    //Update
    update(posting: Posting): void {
        this.postingMap.set(posting.getId(), posting);
    }

    //Delete
    delete(postingId: string): void {
        this.postingMap.delete(postingId);
    }

    //존재여부
    exists(postingId: string): boolean {
        return this.postingMap.get(postingId) !== undefined;
    }
}

export default PostingMapStore;