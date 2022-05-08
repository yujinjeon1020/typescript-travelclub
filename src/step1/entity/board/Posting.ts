import Entity from "../Entity";
import DateUtil from "../../../util/DateUtil";
import SocialBoard from "./SocialBoard";
import CommunityMember from "../club/CommunityMember";

class Posting implements Entity {

    usid: string = '';
    title: string = '';
    writerEmail: string = '';
    contents: string = '';
    writtenDate: string = '';
    readCount: number = 0;

    boardId: string = '';
    sequence: number = 0;

    constructor(postingId: string, boardId: string, title: string, writerEmail: string, contents: string) {
        this.usid = postingId;
        this.boardId = boardId;
        this.title = title;
        this.writerEmail = writerEmail;
        this.contents = contents;
        this.writtenDate = DateUtil.today();
    }

    getId(): string {
        return this.usid;
    }

    //다음 댓글 id
    get nextCommentId(): string {
        return `${this.usid}: ${this.sequence++}`;
    }

    static getSample(board: SocialBoard): Posting[] {
        const postings = [];

        const leader = CommunityMember.getSample();
        const leaderPosting = new Posting(board.nextPostingId, board.getId(), 'The club intro', leader.email, 'Hello, It\'s good to see you');

        postings.push(leaderPosting);

        let postingUsid = board.nextPostingId;
        const member = CommunityMember.getSample();
        const memberPosting = new Posting(board.nextPostingId, board.getId(), 'self intro', member.email, 'Hello, My name is minsoo');

        memberPosting.usid = postingUsid;
        postings.push(memberPosting);

        return postings;
    }
}

export default Posting;