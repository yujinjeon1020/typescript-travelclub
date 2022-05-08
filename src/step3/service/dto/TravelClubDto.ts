import ClubMembership from "../../../step1/entity/club/ClubMembership";
import ClubMembershipDto from "./ClubMembershipDto";
import DateUtil from "../../../util/DateUtil";
import TravelClub from "../../../step1/entity/club/TravelClub";

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

    //Entity -> Dto
    static fromEntity(club: TravelClub): TravelClubDto {
        const clubDto = new TravelClubDto(club.name, club.intro);

        clubDto.usid = club.usid;
        clubDto.foundationDay = club.foundationDate;

        for (const membership of club.membershipList) {
            clubDto.membershipList.push(ClubMembershipDto.fromEntity(membership));      //from Entity
        }
        return clubDto;
    }

    //Dto -> Entity
    toTravelClub(): TravelClub {
        const travelClub = new TravelClub(this.name, this.intro);

        travelClub.usid = this.usid;
        travelClub.foundationDate = this.foundationDay;

        for (const membershipDto of this.membershipList) {
            travelClub.membershipList.push(membershipDto.toMembership());       //to Entity
        }
        return travelClub;
    }
}

export default TravelClubDto;