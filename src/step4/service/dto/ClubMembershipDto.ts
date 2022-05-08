import RoleInClub from "../../../step1/entity/club/RoleInClub";
import DateUtil from "../../../util/DateUtil";
import ClubMembership from "../../../step1/entity/club/ClubMembership";

class ClubMembershipDto {

    clubId: string = '';
    memberEmail: string = '';
    role: RoleInClub = RoleInClub.Member;
    joinDate: string = '';

    constructor(clubId: string, memberEmail: string) {
        this.clubId = clubId;
        this.memberEmail = memberEmail;
        this.joinDate = DateUtil.today();
    }

    //from entity to dto
    static fromEntity(membership: ClubMembership): ClubMembershipDto {
        //dto 객체 생성
        const membershipDto = new ClubMembershipDto(membership.clubId, membership.memberEmail);

        //주입
        membershipDto.role = membership.role;
        membershipDto.joinDate = membership.joinDate;

        return membershipDto;
    }

    //from dto to entity
    toMembership(): ClubMembership {
        //entity 객체 생성
        const membership = new ClubMembership(this.clubId, this.memberEmail);

        //주입
        membership.role = this.role;
        membership.joinDate = this.joinDate;

        return membership;
    }
}

export default ClubMembershipDto;