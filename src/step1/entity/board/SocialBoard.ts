import Entity from "../Entity";
import TravelClub from "../club/TravelClub";
import CommunityMember from "../club/CommunityMember";

class SocialBoard implements Entity {

    clubId: string = '';
    sequence: number = 0;
    name: string = '';
    adminEmail: string = '';
    createDate: string = '';

    constructor(clubId: string, name: string, adminEmail: string) {
        this.clubId = clubId;
        this.name = name;
        this.adminEmail = adminEmail;
    }

    getId(): string {
        return this.clubId;
    }

    get nextPostingId(): string {
        return `${this.clubId}: ${this.sequence++}`;
    }

    static getSample(club: TravelClub): SocialBoard {
        const member = CommunityMember.getSample();
        const board = new SocialBoard(club.usid, club.name, member.email);
        board.createDate = '2021.01.01';
        return board;
    }
}

export default SocialBoard;