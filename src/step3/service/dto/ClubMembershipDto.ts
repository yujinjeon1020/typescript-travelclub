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

    //Entity -> Dto
    static fromEntity(membership: ClubMembership): ClubMembershipDto {
        const membershipDto = new ClubMembershipDto(membership.clubId, membership.memberEmail);

        membershipDto.role = membership.role;
        membershipDto.joinDate = membership.joinDate;

        return membershipDto;
    }

    //Dto -> Entity
    toMembership(): ClubMembership {
        const membership = new ClubMembership(this.clubId, this.memberEmail);

        membership.role = this.role;
        membership.joinDate = this.joinDate;

        return membership;
    }
}

export default ClubMembershipDto;