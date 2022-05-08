import BoardStore from "../store/BoardStore";
import SocialBoard from "../../step1/entity/board/SocialBoard";
import MemoryMap from "./io/MemoryMap";

class BoardMapStore implements BoardStore {

    boardMap: Map<string, SocialBoard>;

    constructor() {
        this.boardMap = MemoryMap.getInstance().boardMap;
    }

    //Create
    create(board: SocialBoard): string {
        const targetBoard = this.boardMap.get(board.getId());

        if (targetBoard) {
            throw new Error('\n> Member already exists with id: ' + board.getId());
        } else {
            this.boardMap.set(board.getId(), board);
        }
        return board.getId();
    }

    //Select
    retrieve(boardId: string): SocialBoard | null {
        return this.boardMap.get(boardId) || null;
    }

    retrieveByName(name: string): SocialBoard[] {
        const boards = Array.from(this.boardMap.values());
        return boards.filter(board => board.name === name);
    }

    retrieveAll(): SocialBoard[] {
        return Array.from(this.boardMap.values());
    }

    //Update
    update(board: SocialBoard): void {
        this.boardMap.set(board.getId(), board);
    }

    //Delete
    delete(boardId: string): void {
        this.boardMap.delete(boardId);
    }

    //존재여부
    exists(boardId: string): boolean {
        return this.boardMap.get(boardId) !== undefined;
    }
}

export default BoardMapStore;