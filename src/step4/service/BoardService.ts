import BoardDto from "./dto/BoardDto";

interface BoardService {

    register(boardDto: BoardDto): string;
    find(boardId: string): BoardDto;
    findByName(boardName: string): BoardDto[];
    findAll(): BoardDto[];
    findByClubName(clubName: string): BoardDto | null;
    modify(boardDto: BoardDto): void;
    remove(boardId: string): void;
}

export default BoardService;