import DateUtil from "../../../util/DateUtil";
import SocialBoard from "../../../step1/entity/board/SocialBoard";

class BoardDto {

    clubId: string = '';
    name: string = '';
    adminEmail: string = '';
    createDate: string = '';

    constructor(clubId: string, name: string, adminEmail: string) {
        this.clubId = clubId;
        this.name = name;
        this.adminEmail = adminEmail;
        this.createDate = DateUtil.today();
    }

    //From Entity to Dto
    static fromEntity(board: SocialBoard): BoardDto {
        //Dto 객체 생성
        const boardDto = new BoardDto(board.clubId, board.name, board.adminEmail);

        //주입
        boardDto.createDate = board.createDate;

        return boardDto;
    }

    //to Entity
    toBoard(): SocialBoard {
        //Entity 객체 생성
        const socialBoard = new SocialBoard(this.clubId, this.name, this.adminEmail);

        //주입
        socialBoard.createDate = this.createDate;

        return socialBoard;
    }
}

export default BoardDto;