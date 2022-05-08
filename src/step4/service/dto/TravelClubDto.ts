import DateUtil from "../../../util/DateUtil";
import TravelClub from "../../../step1/entity/club/TravelClub";
import ClubMembershipDto from "./ClubMembershipDto";

class TravelClubDto {

    usid: string = '';
    name: string = '';
    intro: string = '';
    foundationDay: string = '';

    membershipList: ClubMembershipDto[] = [];

    constructor(name: string, intro: string) {
        this.name = name;
        this.intro = intro;
        this.foundationDay = DateUtil.today();
    }

    //From entity to dto
    static fromEntity(club: TravelClub): TravelClubDto {
        //DTO 객체 생성
        const clubDto = new TravelClubDto(club.name, club.intro);

        clubDto.usid = club.usid;
        clubDto.foundationDay = club.foundationDate;

        //멤버십
        for (const membership of club.membershipList) {
            clubDto.membershipList.push(ClubMembershipDto.fromEntity(membership));       //DTO로 PUSH
        }
        return clubDto;
    }

    //to entity
    toTravelClub(): TravelClub {
        const travelClub = new TravelClub(this.name, this.intro);

        //주입
        travelClub.usid = this.usid;
        travelClub.foundationDate = this.foundationDay;

        //멤버십
        for (const membershipDto of this.membershipList) {
            travelClub.membershipList.push(membershipDto.toMembership());   //ENTITY로 PUSH
        }
        return travelClub;
    }
}

export default TravelClubDto;