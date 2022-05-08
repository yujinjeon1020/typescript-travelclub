import TravelClubDto from "./dto/TravelClubDto";
import ClubMembershipDto from "./dto/ClubMembershipDto";

interface ClubService {

    register(clubDto: TravelClubDto): void;
    find(clubId: string): TravelClubDto;
    findByName(name: string): TravelClubDto;
    modify(clubDto: TravelClubDto): void;
    remove(clubId: string): void;

    //멤버십
    addMembership(membershipDto: ClubMembershipDto): void;
    findMembershipIn(clubId: string, memberId: string): ClubMembershipDto | null;
    modifyMembership(clubId: string, membershipDto: ClubMembershipDto): void;
    removeMembership(clubId: string, memberId: string): void;
}

export default ClubService;