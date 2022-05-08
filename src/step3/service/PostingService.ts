import PostingDto from "./dto/PostingDto";

interface PostingService {

    register(boardId: string, postingDto: PostingDto): string;
    find(postingId: string): PostingDto;
    findByBoardId(boardId: string): PostingDto[];   //게시글목록
    modify(postingDto: PostingDto): void;
    remove(postingId: string): void;
}

export default PostingService;