import ClubService from "../service/ClubService";
import ClubStore from "../store/ClubStore";
import MemberStore from "../store/MemberStore";
import ClubMapStoreLycler from "../da.map/ClubMapStoreLycler";
import TravelClubDto from "../service/dto/TravelClubDto";
import ClubMembershipDto from "../service/dto/ClubMembershipDto";
import TravelClub from "../../step1/entity/club/TravelClub";
import ClubMembership from "../../step1/entity/club/ClubMembership";
import RoleInClub from "../../step1/entity/club/RoleInClub";

class ClubServiceLogic implements ClubService {

    clubStore: ClubStore;
    memberStore: MemberStore;

    constructor() {
        this.clubStore = ClubMapStoreLycler.getInstance().requestClubStore();
        this.memberStore = ClubMapStoreLycler.getInstance().requestMemberStore();
    }

    //클럽 등록
    register(clubDto: TravelClubDto): void {
        const foundClub = this.clubStore.retrieveByName(clubDto.name);

        if (foundClub) {
            throw new Error('Club already exists with name: ' + clubDto.name);
        }
        const clubId = this.clubStore.create(clubDto.toTravelClub());           //ENTITY로
        clubDto.usid = clubId;
    }

    //클럽 찾기
    find(clubId: string): TravelClubDto {
        const foundClub = this.clubStore.retrieve(clubId);

        if (!foundClub) {
            throw new Error('No such club with name: ' + clubId);
        }
        return TravelClubDto.fromEntity(foundClub);             //Dto로 보여주기
    }

    //이름으로 클럽 찾기
    findByName(name: string): TravelClubDto {
        const foundClub = this.clubStore.retrieveByName(name);

        if (!foundClub) {
            throw new Error('No such club with name: ' + name);
        }
        return TravelClubDto.fromEntity(foundClub);         //Dto로 보여주기
    }

    //클럽 수정
    modify(clubDto: TravelClubDto): void {
        const foundClub = this.clubStore.retrieveByName(clubDto.name);

        if (foundClub) {
            throw new Error('Club already exists with name: ' + clubDto.name);
        }

        const targetClub = this.clubStore.retrieve(clubDto.usid);

        if (!targetClub) {
            throw new Error('No such club with id: ' + clubDto.usid);
        }

        //수정이 안되었으면 Entity에서 원래 값 받아오기
        if (!clubDto.name) {
            clubDto.name = targetClub.name
        }

        if (!clubDto.intro) {
            clubDto.intro = targetClub.intro;
        }

        this.clubStore.update(clubDto.toTravelClub());          //ENTITY로
    }

    //클럽 삭제
    remove(clubId: string): void {
        if (!this.clubStore.exists(clubId)) {
            throw new Error('No such club with id: ' + clubId);
        }
        this.clubStore.delete(clubId);
    }

    //Membership
    addMembership(membershipDto: ClubMembershipDto): void {
        const memberId = membershipDto.memberEmail;

        const foundMember = this.memberStore.retrieve(memberId);        //회원 중에 찾고

        if (!foundMember) {
            throw new Error('No such member with email: ' + memberId);
        }
        const foundClub = this.clubStore.retrieve(membershipDto.clubId);

        if (!foundClub) {
            throw new Error('No such club with id: ' + membershipDto.clubId);
        }

        const membership = foundClub.membershipList.find(membership => membership.memberEmail === memberId);

        if (membership) {
            throw new Error('Member already exists in the club => ' + memberId);
        }

        //멤버십 추가 작동
        //클럽 멤버십에 해당 회원 추가
        foundClub.membershipList.push(membershipDto.toMembership());            //entity로 데이터 추가
        //클럽 상태 업뎃!
        this.clubStore.update(foundClub);

        //해당 회원의 멤버십에 해당 클럽..추가..?
        foundMember.membershipList.push(membershipDto.toMembership());             //entity로 데이터 추가
        //회원 상태 업뎃
        this.memberStore.update(foundMember);
    }

    //멤버십 찾기
    findMembershipIn(clubId: string, memberId: string): ClubMembershipDto | null {
        //클럽을 먼저 찾고
        const foundClub = this.clubStore.retrieve(clubId);
        let membership = null;

        if (foundClub) {
            //멤버십을 찾고
            membership = this.getMembershipIn(foundClub, memberId);
        }
        //보여준다
        return membership ? ClubMembershipDto.fromEntity(membership) : null;            //멤버십이 존재하면 dto로 보여주고, 없으면 null 리턴
    }

    //멤버십 수정 (role 수정)
    modifyMembership(clubId: string, membershipDto: ClubMembershipDto): void {
        //수정할 멤버십 이메일을 찾고
        const targetEmail = membershipDto.memberEmail;
        //수정할 role을 찾고
        const newRole = membershipDto.role;
        //클럽을 찾고
        const targetClub = this.clubStore.retrieve(clubId);

        if (targetClub) {
            //멤버십을 가져오고
            const membershipOfClub = this.getMembershipIn(targetClub, targetEmail); //Entity
            //Entity에 role을 저장하고
            membershipOfClub.role = newRole as RoleInClub;
            //클럽 정보 업뎃
            this.clubStore.update(targetClub);
        }
        //멤버 정보 업뎃 시작
        const targetMember = this.memberStore.retrieve(targetEmail);
        //멤버가 가입한 카페중에 targetClud에 해당하는 클럽 멤버십만을 업뎃해준다
        if (targetMember) {
            targetMember.membershipList.filter(membershipOfMember => membershipOfMember.clubId === clubId)
                                        .map(membershipOfMember => membershipOfMember.role = newRole);

            this.memberStore.update(targetMember);
        }
    }

    //멤버십 삭제
    removeMembership(clubId: string, memberId: string): void {
        const foundClub = this.clubStore.retrieve(clubId);
        const foundMember = this.memberStore.retrieve(memberId);

        if (foundClub && foundMember) {
            const clubMembership = this.getMembershipIn(foundClub, memberId);

            //클럽에서
            const clubIndex = foundClub.membershipList.indexOf(clubMembership);

            //회원에서
            const memberIndex = foundMember.membershipList.indexOf(clubMembership);

            foundClub.membershipList.splice(clubIndex, 1);
            foundMember.membershipList.splice(memberIndex, 1);
        }
    }

    //내부 메소드
    //클럽의 멤버십을 가져오기
    private getMembershipIn(club: TravelClub, memberEmail: string): ClubMembership {

        for (const membership of club.membershipList) {
            if (memberEmail === membership.memberEmail) {
                return membership;
            }
        }
        throw new Error(`No such member [${memberEmail}] in club [${club.name}`);
    }
}

export default ClubServiceLogic;