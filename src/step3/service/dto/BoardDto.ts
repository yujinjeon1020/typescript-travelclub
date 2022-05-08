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

    //Entity -> Dto
    static fromEntity(board: SocialBoard): BoardDto {
        const boardDto = new BoardDto(board.clubId, board.name, board.adminEmail);

        boardDto.createDate = board.createDate;

        return boardDto;
    }

    //Dto -> Entity
    toBoard(): SocialBoard {
        const socialBoard = new SocialBoard(this.clubId, this.name, this.adminEmail);

        socialBoard.createDate = this.createDate;

        return socialBoard;
    }
}

export default BoardDto;